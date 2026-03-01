'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { Ticker } from '@/types';

const TYPES      = ['equity', 'etf', 'index', 'fx', 'commodity', 'rate'];
const CATEGORIES = ['fx', 'global_index', 'rate', 'commodity', 'us_sector', 'sector_leader', 'thematic'];

const BLANK_FORM = { symbol: '', name: '', type: 'equity', category: 'sector_leader', description: '' };

interface Props { tickers: Ticker[] }

type FormData = typeof BLANK_FORM;

// ── tiny shared input style ────────────────────────────────────────────────────
const inp = 'bg-[var(--bg-elevated)] border border-[var(--border)] rounded px-2 py-1 text-xs text-[var(--text-primary)] w-full focus:outline-none focus:border-[var(--text-accent)]';
const sel = inp + ' cursor-pointer';
const btn = (variant: 'primary' | 'danger' | 'ghost') =>
  `px-3 py-1 rounded text-xs font-mono transition-colors ${
    variant === 'primary'
      ? 'bg-[var(--text-accent)] text-[var(--bg-primary)] hover:opacity-90'
      : variant === 'danger'
      ? 'bg-[var(--red)] text-white hover:opacity-90'
      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
  }`;

export function TickerManager({ tickers: initial }: Props) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [filter,     setFilter]     = useState('');
  const [editingId,  setEditingId]  = useState<string | null>(null);
  const [editForm,   setEditForm]   = useState<FormData>(BLANK_FORM);
  const [showAdd,    setShowAdd]    = useState(false);
  const [addForm,    setAddForm]    = useState<FormData>(BLANK_FORM);
  const [confirmDel, setConfirmDel] = useState<string | null>(null);
  const [busy,       setBusy]       = useState(false);
  const [error,      setError]      = useState<string | null>(null);

  const refresh = () => startTransition(() => { router.refresh(); });

  async function api(url: string, method: string, body?: object) {
    setError(null);
    setBusy(true);
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error((data as { error?: string }).error ?? 'Request failed');
      return data;
    } finally {
      setBusy(false);
    }
  }

  async function handleAdd() {
    try {
      await api('/api/tickers', 'POST', addForm);
      setShowAdd(false);
      setAddForm(BLANK_FORM);
      refresh();
    } catch (e) { setError((e as Error).message); }
  }

  async function handleEditSave(id: string) {
    try {
      await api(`/api/tickers/${id}`, 'PUT', editForm);
      setEditingId(null);
      refresh();
    } catch (e) { setError((e as Error).message); }
  }

  async function handleDelete(id: string) {
    try {
      await api(`/api/tickers/${id}`, 'DELETE');
      setConfirmDel(null);
      refresh();
    } catch (e) { setError((e as Error).message); }
  }

  async function handleToggle(t: Ticker) {
    try {
      await api(`/api/tickers/${t.id}`, 'PUT', { isActive: !t.isActive });
      refresh();
    } catch (e) { setError((e as Error).message); }
  }

  const filtered = initial.filter((t) => {
    const q = filter.toLowerCase();
    return (
      !q ||
      t.symbol.toLowerCase().includes(q) ||
      t.name.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.type.toLowerCase().includes(q)
    );
  });

  // ── tiny sub-component for a form row ────────────────────────────────────
  const FormRow = ({
    form, setForm, onSave, onCancel, saveLabel = 'Save',
  }: {
    form: FormData;
    setForm: (f: FormData) => void;
    onSave: () => void;
    onCancel: () => void;
    saveLabel?: string;
  }) => (
    <tr className="bg-[var(--bg-elevated)]">
      <td className="px-2 py-1.5">
        <input className={inp} placeholder="AAPL" value={form.symbol}
          onChange={(e) => setForm({ ...form, symbol: e.target.value.toUpperCase() })} />
      </td>
      <td className="px-2 py-1.5">
        <input className={inp} placeholder="Apple Inc." value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })} />
      </td>
      <td className="px-2 py-1.5">
        <select className={sel} value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}>
          {TYPES.map((v) => <option key={v} value={v}>{v}</option>)}
        </select>
      </td>
      <td className="px-2 py-1.5">
        <select className={sel} value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}>
          {CATEGORIES.map((v) => <option key={v} value={v}>{v}</option>)}
        </select>
      </td>
      <td className="px-2 py-1.5">
        <input className={inp} placeholder="Optional description" value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </td>
      <td className="px-2 py-1.5 text-center">—</td>
      <td className="px-2 py-1.5">
        <div className="flex gap-1.5">
          <button className={btn('primary')} onClick={onSave} disabled={busy}>{saveLabel}</button>
          <button className={btn('ghost')} onClick={onCancel}>Cancel</button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="flex flex-col gap-4">
      {/* ── Toolbar ── */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          className={btn('primary')}
          onClick={() => { setShowAdd(true); setError(null); }}
          disabled={showAdd}
        >
          + Add Ticker
        </button>
        <input
          className={`${inp} max-w-xs`}
          placeholder="Filter by symbol, name, category…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <span className="ml-auto text-xs text-[var(--text-secondary)] font-mono">
          {filtered.length} / {initial.length} tickers
        </span>
      </div>

      {/* ── Error banner ── */}
      {error && (
        <div className="text-xs text-[var(--red)] bg-[var(--bg-elevated)] border border-[var(--red)] rounded px-3 py-2">
          {error}
        </div>
      )}

      {/* ── Table ── */}
      <div className="overflow-x-auto rounded border border-[var(--border)]">
        <table className="w-full text-xs text-[var(--text-primary)] border-collapse">
          <thead>
            <tr className="bg-[var(--bg-elevated)] text-[var(--text-secondary)] font-mono uppercase text-[10px] tracking-wider">
              {['Symbol', 'Name', 'Type', 'Category', 'Description', 'Active', 'Actions'].map((h) => (
                <th key={h} className="px-2 py-2 text-left font-medium border-b border-[var(--border)]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Add row at top */}
            {showAdd && (
              <FormRow
                form={addForm}
                setForm={setAddForm}
                onSave={handleAdd}
                onCancel={() => { setShowAdd(false); setAddForm(BLANK_FORM); }}
                saveLabel="Add"
              />
            )}

            {filtered.map((t) => (
              editingId === t.id ? (
                <FormRow
                  key={t.id}
                  form={editForm}
                  setForm={setEditForm}
                  onSave={() => handleEditSave(t.id)}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <tr
                  key={t.id}
                  className={`border-b border-[var(--border)] transition-colors hover:bg-[var(--bg-elevated)] ${
                    !t.isActive ? 'opacity-40' : ''
                  }`}
                >
                  <td className="px-2 py-1.5 font-mono font-semibold text-[var(--text-accent)]">
                    {t.symbol}
                  </td>
                  <td className="px-2 py-1.5 max-w-[180px] truncate">{t.name}</td>
                  <td className="px-2 py-1.5 text-[var(--text-secondary)]">{t.type}</td>
                  <td className="px-2 py-1.5 text-[var(--text-secondary)]">{t.category}</td>
                  <td className="px-2 py-1.5 max-w-[200px] truncate text-[var(--text-secondary)]">
                    {t.description ?? '—'}
                  </td>
                  <td className="px-2 py-1.5 text-center">
                    <button
                      title={t.isActive ? 'Deactivate' : 'Activate'}
                      onClick={() => handleToggle(t)}
                      disabled={busy}
                      className={`w-8 h-4 rounded-full transition-colors ${
                        t.isActive ? 'bg-[var(--green)]' : 'bg-[var(--border)]'
                      }`}
                    />
                  </td>
                  <td className="px-2 py-1.5">
                    {confirmDel === t.id ? (
                      <div className="flex items-center gap-1.5">
                        <span className="text-[var(--red)] font-mono text-[10px]">Delete?</span>
                        <button className={btn('danger')} onClick={() => handleDelete(t.id)} disabled={busy}>
                          Yes
                        </button>
                        <button className={btn('ghost')} onClick={() => setConfirmDel(null)}>
                          No
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-1.5">
                        <button
                          className={btn('ghost')}
                          onClick={() => {
                            setEditingId(t.id);
                            setEditForm({
                              symbol: t.symbol,
                              name: t.name,
                              type: t.type,
                              category: t.category,
                              description: t.description ?? '',
                            });
                          }}
                        >
                          Edit
                        </button>
                        <button className={btn('danger')} onClick={() => setConfirmDel(t.id)}>
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
