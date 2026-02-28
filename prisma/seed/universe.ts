export interface TickerSeed {
  symbol: string;
  name: string;
  type: string;
  category: string;
  description?: string;
}

export const universe: TickerSeed[] = [
  // ── FX ──────────────────────────────────────────────────────────────────
  { symbol: 'EURUSD=X', name: 'EUR/USD', type: 'fx', category: 'fx', description: 'Euro vs US Dollar' },
  { symbol: 'GBPUSD=X', name: 'GBP/USD', type: 'fx', category: 'fx', description: 'British Pound vs US Dollar' },
  { symbol: 'USDJPY=X', name: 'USD/JPY', type: 'fx', category: 'fx', description: 'US Dollar vs Japanese Yen' },
  { symbol: 'USDCHF=X', name: 'USD/CHF', type: 'fx', category: 'fx', description: 'US Dollar vs Swiss Franc' },
  { symbol: 'AUDUSD=X', name: 'AUD/USD', type: 'fx', category: 'fx', description: 'Australian Dollar vs US Dollar' },
  { symbol: 'NZDUSD=X', name: 'NZD/USD', type: 'fx', category: 'fx', description: 'New Zealand Dollar vs US Dollar' },
  { symbol: 'USDCAD=X', name: 'USD/CAD', type: 'fx', category: 'fx', description: 'US Dollar vs Canadian Dollar' },
  { symbol: 'EURGBP=X', name: 'EUR/GBP', type: 'fx', category: 'fx', description: 'Euro vs British Pound' },
  { symbol: 'EURJPY=X', name: 'EUR/JPY', type: 'fx', category: 'fx', description: 'Euro vs Japanese Yen' },
  { symbol: 'GBPJPY=X', name: 'GBP/JPY', type: 'fx', category: 'fx', description: 'British Pound vs Japanese Yen' },
  { symbol: 'AUDJPY=X', name: 'AUD/JPY', type: 'fx', category: 'fx', description: 'Australian Dollar vs Japanese Yen' },
  { symbol: 'CADJPY=X', name: 'CAD/JPY', type: 'fx', category: 'fx', description: 'Canadian Dollar vs Japanese Yen' },
  { symbol: 'USDMXN=X', name: 'USD/MXN', type: 'fx', category: 'fx', description: 'US Dollar vs Mexican Peso' },
  { symbol: 'USDBRL=X', name: 'USD/BRL', type: 'fx', category: 'fx', description: 'US Dollar vs Brazilian Real' },
  { symbol: 'USDINR=X', name: 'USD/INR', type: 'fx', category: 'fx', description: 'US Dollar vs Indian Rupee' },
  { symbol: 'USDCNY=X', name: 'USD/CNY', type: 'fx', category: 'fx', description: 'US Dollar vs Chinese Yuan' },
  { symbol: 'USDZAR=X', name: 'USD/ZAR', type: 'fx', category: 'fx', description: 'US Dollar vs South African Rand' },
  { symbol: 'USDKRW=X', name: 'USD/KRW', type: 'fx', category: 'fx', description: 'US Dollar vs South Korean Won' },
  { symbol: 'USDTRY=X', name: 'USD/TRY', type: 'fx', category: 'fx', description: 'US Dollar vs Turkish Lira' },
  { symbol: 'DX-Y.NYB', name: 'US Dollar Index', type: 'index', category: 'fx', description: 'DXY — measures USD vs basket of major currencies' },

  // ── GLOBAL INDEXES ───────────────────────────────────────────────────────
  { symbol: '^GSPC', name: 'S&P 500', type: 'index', category: 'global_index', description: 'US large-cap equity benchmark (500 stocks)' },
  { symbol: '^DJI', name: 'Dow Jones', type: 'index', category: 'global_index', description: 'US blue-chip index (30 stocks, price-weighted)' },
  { symbol: '^IXIC', name: 'Nasdaq Composite', type: 'index', category: 'global_index', description: 'US technology-heavy composite index' },
  { symbol: '^RUT', name: 'Russell 2000', type: 'index', category: 'global_index', description: 'US small-cap equity benchmark' },
  { symbol: '^VIX', name: 'VIX', type: 'index', category: 'global_index', description: 'CBOE Volatility Index — S&P 500 30-day implied vol' },
  { symbol: '^FTSE', name: 'FTSE 100', type: 'index', category: 'global_index', description: 'UK large-cap equity benchmark (London Stock Exchange)' },
  { symbol: '^GDAXI', name: 'DAX', type: 'index', category: 'global_index', description: 'German blue-chip equity benchmark (Frankfurt)' },
  { symbol: '^FCHI', name: 'CAC 40', type: 'index', category: 'global_index', description: 'French large-cap equity benchmark (Euronext Paris)' },
  { symbol: '^STOXX50E', name: 'Euro Stoxx 50', type: 'index', category: 'global_index', description: 'Blue-chip index for the Eurozone (50 stocks)' },
  { symbol: '^N225', name: 'Nikkei 225', type: 'index', category: 'global_index', description: 'Japanese blue-chip equity benchmark' },
  { symbol: '^HSI', name: 'Hang Seng', type: 'index', category: 'global_index', description: 'Hong Kong large-cap equity benchmark' },
  { symbol: '^AXJO', name: 'ASX 200', type: 'index', category: 'global_index', description: 'Australian large-cap equity benchmark' },
  { symbol: '000001.SS', name: 'Shanghai Composite', type: 'index', category: 'global_index', description: 'Chinese A-share equity benchmark (SSE)' },
  { symbol: 'EEM', name: 'iShares MSCI Emerging Markets', type: 'etf', category: 'global_index', description: 'Broad exposure to emerging market equities' },
  { symbol: 'EWJ', name: 'iShares MSCI Japan', type: 'etf', category: 'global_index', description: 'Japanese equity ETF' },
  { symbol: 'EWZ', name: 'iShares MSCI Brazil', type: 'etf', category: 'global_index', description: 'Brazilian equity ETF' },
  { symbol: 'FXI', name: 'iShares China Large-Cap', type: 'etf', category: 'global_index', description: 'Chinese large-cap equity ETF (H-shares)' },
  { symbol: 'EWG', name: 'iShares MSCI Germany', type: 'etf', category: 'global_index', description: 'German equity ETF' },

  // ── RATES ────────────────────────────────────────────────────────────────
  { symbol: '^IRX', name: '13-Week T-Bill Yield', type: 'rate', category: 'rate', description: 'US 13-week Treasury bill yield (front-end rates)' },
  { symbol: '^FVX', name: '5-Year Treasury Yield', type: 'rate', category: 'rate', description: 'US 5-year Treasury yield' },
  { symbol: '^TNX', name: '10-Year Treasury Yield', type: 'rate', category: 'rate', description: 'US 10-year Treasury yield — benchmark risk-free rate' },
  { symbol: '^TYX', name: '30-Year Treasury Yield', type: 'rate', category: 'rate', description: 'US 30-year Treasury yield' },
  { symbol: 'TLT', name: 'iShares 20+ Year Treasury', type: 'etf', category: 'rate', description: 'Long-duration US Treasury bond ETF' },
  { symbol: 'IEF', name: 'iShares 7-10 Year Treasury', type: 'etf', category: 'rate', description: 'Intermediate-duration US Treasury bond ETF' },
  { symbol: 'SHY', name: 'iShares 1-3 Year Treasury', type: 'etf', category: 'rate', description: 'Short-duration US Treasury bond ETF' },
  { symbol: 'TBT', name: 'ProShares UltraShort 20+ Year', type: 'etf', category: 'rate', description: '2x inverse long-duration Treasury ETF' },
  { symbol: 'LQD', name: 'iShares Investment Grade Corp Bond', type: 'etf', category: 'rate', description: 'US investment-grade corporate bond ETF' },
  { symbol: 'HYG', name: 'iShares High Yield Corp Bond', type: 'etf', category: 'rate', description: 'US high-yield (junk) corporate bond ETF' },
  { symbol: 'TIP', name: 'iShares TIPS Bond', type: 'etf', category: 'rate', description: 'US Treasury Inflation-Protected Securities ETF' },
  { symbol: 'EMLC', name: 'VanEck EM Local Currency Bond', type: 'etf', category: 'rate', description: 'Emerging market local currency government bond ETF' },

  // ── COMMODITIES ──────────────────────────────────────────────────────────
  { symbol: 'GC=F', name: 'Gold Futures', type: 'commodity', category: 'commodity', description: 'Gold front-month futures contract (COMEX)' },
  { symbol: 'SI=F', name: 'Silver Futures', type: 'commodity', category: 'commodity', description: 'Silver front-month futures contract (COMEX)' },
  { symbol: 'CL=F', name: 'Crude Oil WTI', type: 'commodity', category: 'commodity', description: 'WTI crude oil front-month futures (NYMEX)' },
  { symbol: 'BZ=F', name: 'Brent Crude Oil', type: 'commodity', category: 'commodity', description: 'Brent crude oil front-month futures' },
  { symbol: 'NG=F', name: 'Natural Gas', type: 'commodity', category: 'commodity', description: 'Natural gas front-month futures (Henry Hub)' },
  { symbol: 'HG=F', name: 'Copper Futures', type: 'commodity', category: 'commodity', description: 'Copper front-month futures — global growth proxy' },
  { symbol: 'PL=F', name: 'Platinum Futures', type: 'commodity', category: 'commodity', description: 'Platinum front-month futures' },
  { symbol: 'PA=F', name: 'Palladium Futures', type: 'commodity', category: 'commodity', description: 'Palladium front-month futures' },
  { symbol: 'GLD', name: 'SPDR Gold Trust', type: 'etf', category: 'commodity', description: 'Gold ETF tracking physical gold price' },
  { symbol: 'SLV', name: 'iShares Silver Trust', type: 'etf', category: 'commodity', description: 'Silver ETF tracking physical silver price' },
  { symbol: 'USO', name: 'United States Oil Fund', type: 'etf', category: 'commodity', description: 'WTI crude oil ETF' },
  { symbol: 'UNG', name: 'United States Natural Gas Fund', type: 'etf', category: 'commodity', description: 'Natural gas ETF' },
  { symbol: 'PDBC', name: 'Invesco DB Commodity Index', type: 'etf', category: 'commodity', description: 'Diversified commodity ETF (energy, metals, agriculture)' },
  { symbol: 'DBA', name: 'Invesco DB Agriculture Fund', type: 'etf', category: 'commodity', description: 'Agriculture commodity ETF' },
  { symbol: 'CORN', name: 'Teucrium Corn Fund', type: 'etf', category: 'commodity', description: 'Corn futures ETF' },
  { symbol: 'WEAT', name: 'Teucrium Wheat Fund', type: 'etf', category: 'commodity', description: 'Wheat futures ETF' },
  { symbol: 'SOYB', name: 'Teucrium Soybean Fund', type: 'etf', category: 'commodity', description: 'Soybean futures ETF' },
  { symbol: 'COPX', name: 'Global X Copper Miners', type: 'etf', category: 'commodity', description: 'ETF of copper mining equities' },
  { symbol: 'URA', name: 'Global X Uranium ETF', type: 'etf', category: 'commodity', description: 'Uranium mining equities ETF' },

  // ── US SECTOR ETFs ───────────────────────────────────────────────────────
  { symbol: 'XLK', name: 'Technology Select Sector SPDR', type: 'etf', category: 'us_sector', description: 'S&P 500 Technology sector ETF' },
  { symbol: 'XLF', name: 'Financial Select Sector SPDR', type: 'etf', category: 'us_sector', description: 'S&P 500 Financials sector ETF' },
  { symbol: 'XLE', name: 'Energy Select Sector SPDR', type: 'etf', category: 'us_sector', description: 'S&P 500 Energy sector ETF' },
  { symbol: 'XLV', name: 'Health Care Select Sector SPDR', type: 'etf', category: 'us_sector', description: 'S&P 500 Health Care sector ETF' },
  { symbol: 'XLI', name: 'Industrial Select Sector SPDR', type: 'etf', category: 'us_sector', description: 'S&P 500 Industrials sector ETF' },
  { symbol: 'XLY', name: 'Consumer Discret. Select Sector SPDR', type: 'etf', category: 'us_sector', description: 'S&P 500 Consumer Discretionary sector ETF' },
  { symbol: 'XLP', name: 'Consumer Staples Select Sector SPDR', type: 'etf', category: 'us_sector', description: 'S&P 500 Consumer Staples sector ETF' },
  { symbol: 'XLRE', name: 'Real Estate Select Sector SPDR', type: 'etf', category: 'us_sector', description: 'S&P 500 Real Estate sector ETF' },
  { symbol: 'XLU', name: 'Utilities Select Sector SPDR', type: 'etf', category: 'us_sector', description: 'S&P 500 Utilities sector ETF' },
  { symbol: 'XLB', name: 'Materials Select Sector SPDR', type: 'etf', category: 'us_sector', description: 'S&P 500 Materials sector ETF' },
  { symbol: 'XLC', name: 'Communication Services Select Sector SPDR', type: 'etf', category: 'us_sector', description: 'S&P 500 Communication Services sector ETF' },

  // ── SECTOR LEADERS — Technology ──────────────────────────────────────────
  { symbol: 'AAPL', name: 'Apple', type: 'equity', category: 'sector_leader', description: 'Consumer electronics, software, and services (iPhone, Mac, Services)' },
  { symbol: 'MSFT', name: 'Microsoft', type: 'equity', category: 'sector_leader', description: 'Enterprise software, cloud (Azure), AI, and gaming' },
  { symbol: 'NVDA', name: 'NVIDIA', type: 'equity', category: 'sector_leader', description: 'AI/ML GPUs, data center accelerators, gaming chips' },
  { symbol: 'AVGO', name: 'Broadcom', type: 'equity', category: 'sector_leader', description: 'Semiconductors and infrastructure software' },
  { symbol: 'QCOM', name: 'Qualcomm', type: 'equity', category: 'sector_leader', description: 'Mobile processors (Snapdragon), wireless technology' },
  { symbol: 'TXN', name: 'Texas Instruments', type: 'equity', category: 'sector_leader', description: 'Analog and embedded semiconductors for industrial/auto' },
  { symbol: 'AMD', name: 'Advanced Micro Devices', type: 'equity', category: 'sector_leader', description: 'CPUs, GPUs, and data center accelerators' },
  { symbol: 'MU', name: 'Micron Technology', type: 'equity', category: 'sector_leader', description: 'DRAM and NAND flash memory chips' },

  // ── SECTOR LEADERS — Financials ───────────────────────────────────────────
  { symbol: 'JPM', name: 'JPMorgan Chase', type: 'equity', category: 'sector_leader', description: 'Largest US bank — investment banking, retail, asset management' },
  { symbol: 'GS', name: 'Goldman Sachs', type: 'equity', category: 'sector_leader', description: 'Leading investment bank, trading, and asset management' },
  { symbol: 'BRK-B', name: 'Berkshire Hathaway B', type: 'equity', category: 'sector_leader', description: 'Diversified conglomerate — insurance, railroads, utilities, equities' },
  { symbol: 'V', name: 'Visa', type: 'equity', category: 'sector_leader', description: 'Global payment network and card processing' },
  { symbol: 'MA', name: 'Mastercard', type: 'equity', category: 'sector_leader', description: 'Global payment network and card processing' },
  { symbol: 'BAC', name: 'Bank of America', type: 'equity', category: 'sector_leader', description: 'US universal bank — retail, commercial, investment banking' },
  { symbol: 'MS', name: 'Morgan Stanley', type: 'equity', category: 'sector_leader', description: 'Investment bank, wealth management, and asset management' },

  // ── SECTOR LEADERS — Energy ───────────────────────────────────────────────
  { symbol: 'XOM', name: 'ExxonMobil', type: 'equity', category: 'sector_leader', description: 'Integrated oil & gas — largest US energy major' },
  { symbol: 'CVX', name: 'Chevron', type: 'equity', category: 'sector_leader', description: 'Integrated oil & gas — US energy major' },
  { symbol: 'COP', name: 'ConocoPhillips', type: 'equity', category: 'sector_leader', description: 'Exploration & production — low-cost oil & gas producer' },
  { symbol: 'EOG', name: 'EOG Resources', type: 'equity', category: 'sector_leader', description: 'Shale oil & gas E&P — Permian, Eagle Ford' },
  { symbol: 'SLB', name: 'SLB (Schlumberger)', type: 'equity', category: 'sector_leader', description: 'Oilfield services — largest globally' },
  { symbol: 'OXY', name: 'Occidental Petroleum', type: 'equity', category: 'sector_leader', description: 'Oil & gas E&P with chemical segment — Permian heavy' },

  // ── SECTOR LEADERS — Health Care ──────────────────────────────────────────
  { symbol: 'LLY', name: 'Eli Lilly', type: 'equity', category: 'sector_leader', description: 'Pharma — GLP-1 obesity/diabetes drugs (Mounjaro, Zepbound)' },
  { symbol: 'UNH', name: 'UnitedHealth Group', type: 'equity', category: 'sector_leader', description: 'Largest US managed care and health services company' },
  { symbol: 'JNJ', name: 'Johnson & Johnson', type: 'equity', category: 'sector_leader', description: 'Diversified pharma and MedTech' },
  { symbol: 'ABBV', name: 'AbbVie', type: 'equity', category: 'sector_leader', description: 'Pharma — immunology, oncology (Humira, Skyrizi)' },
  { symbol: 'TMO', name: 'Thermo Fisher Scientific', type: 'equity', category: 'sector_leader', description: 'Life science tools and lab equipment' },
  { symbol: 'AMGN', name: 'Amgen', type: 'equity', category: 'sector_leader', description: 'Biotech — biologics and biosimilars' },

  // ── SECTOR LEADERS — Industrials ──────────────────────────────────────────
  { symbol: 'CAT', name: 'Caterpillar', type: 'equity', category: 'sector_leader', description: 'Heavy construction and mining equipment' },
  { symbol: 'RTX', name: 'RTX (Raytheon)', type: 'equity', category: 'sector_leader', description: 'Aerospace and defense — engines, missiles, avionics' },
  { symbol: 'HON', name: 'Honeywell', type: 'equity', category: 'sector_leader', description: 'Diversified industrial — automation, aerospace, building tech' },
  { symbol: 'UNP', name: 'Union Pacific', type: 'equity', category: 'sector_leader', description: 'Class 1 railroad — Western US freight network' },
  { symbol: 'GE', name: 'GE Aerospace', type: 'equity', category: 'sector_leader', description: 'Jet engines and aerospace systems' },
  { symbol: 'LMT', name: 'Lockheed Martin', type: 'equity', category: 'sector_leader', description: 'Defense — F-35, missiles, space systems' },

  // ── SECTOR LEADERS — Consumer Discretionary ──────────────────────────────
  { symbol: 'AMZN', name: 'Amazon', type: 'equity', category: 'sector_leader', description: 'E-commerce, AWS cloud, advertising, and logistics' },
  { symbol: 'TSLA', name: 'Tesla', type: 'equity', category: 'sector_leader', description: 'Electric vehicles, energy storage, and autonomy' },
  { symbol: 'HD', name: 'Home Depot', type: 'equity', category: 'sector_leader', description: 'Largest US home improvement retailer' },
  { symbol: 'MCD', name: "McDonald's", type: 'equity', category: 'sector_leader', description: 'Global fast food franchise — largest by revenue' },
  { symbol: 'NKE', name: 'Nike', type: 'equity', category: 'sector_leader', description: 'Athletic footwear, apparel, and equipment' },
  { symbol: 'LOW', name: "Lowe's", type: 'equity', category: 'sector_leader', description: 'US home improvement retailer' },

  // ── SECTOR LEADERS — Consumer Staples ────────────────────────────────────
  { symbol: 'WMT', name: 'Walmart', type: 'equity', category: 'sector_leader', description: 'Largest US retailer — grocery, general merchandise, e-commerce' },
  { symbol: 'PG', name: 'Procter & Gamble', type: 'equity', category: 'sector_leader', description: 'Consumer goods — cleaning, personal care, baby products' },
  { symbol: 'KO', name: 'Coca-Cola', type: 'equity', category: 'sector_leader', description: 'Beverages — soft drinks, water, juice globally' },
  { symbol: 'PEP', name: 'PepsiCo', type: 'equity', category: 'sector_leader', description: 'Beverages and snacks (Frito-Lay, Gatorade)' },
  { symbol: 'COST', name: 'Costco', type: 'equity', category: 'sector_leader', description: 'Membership warehouse retailer — bulk goods' },
  { symbol: 'PM', name: 'Philip Morris', type: 'equity', category: 'sector_leader', description: 'International tobacco and nicotine products (IQOS)' },

  // ── SECTOR LEADERS — Real Estate ──────────────────────────────────────────
  { symbol: 'PLD', name: 'Prologis', type: 'equity', category: 'sector_leader', description: 'Industrial REIT — logistics and warehouse properties globally' },
  { symbol: 'AMT', name: 'American Tower', type: 'equity', category: 'sector_leader', description: 'Cell tower REIT — global wireless infrastructure' },
  { symbol: 'EQIX', name: 'Equinix', type: 'equity', category: 'sector_leader', description: 'Data center REIT — global colocation and interconnection' },
  { symbol: 'DLR', name: 'Digital Realty', type: 'equity', category: 'sector_leader', description: 'Data center REIT' },
  { symbol: 'SPG', name: 'Simon Property Group', type: 'equity', category: 'sector_leader', description: 'Largest US mall REIT — premium shopping centers' },
  { symbol: 'O', name: 'Realty Income', type: 'equity', category: 'sector_leader', description: 'Net lease REIT — retail and industrial properties' },

  // ── SECTOR LEADERS — Utilities ────────────────────────────────────────────
  { symbol: 'NEE', name: 'NextEra Energy', type: 'equity', category: 'sector_leader', description: 'Largest US utility — wind, solar, and nuclear power' },
  { symbol: 'DUK', name: 'Duke Energy', type: 'equity', category: 'sector_leader', description: 'Regulated electric utility — Southeast/Midwest US' },
  { symbol: 'SO', name: 'Southern Company', type: 'equity', category: 'sector_leader', description: 'Regulated electric and gas utility — Southeast US' },
  { symbol: 'AEP', name: 'American Electric Power', type: 'equity', category: 'sector_leader', description: 'Regulated electric utility — Midwest and South' },
  { symbol: 'CEG', name: 'Constellation Energy', type: 'equity', category: 'sector_leader', description: 'Largest US nuclear power generator' },

  // ── SECTOR LEADERS — Materials ────────────────────────────────────────────
  { symbol: 'LIN', name: 'Linde', type: 'equity', category: 'sector_leader', description: 'Industrial gases — largest globally' },
  { symbol: 'FCX', name: 'Freeport-McMoRan', type: 'equity', category: 'sector_leader', description: 'Copper and gold mining — largest publicly traded copper miner' },
  { symbol: 'NEM', name: 'Newmont', type: 'equity', category: 'sector_leader', description: 'Largest gold mining company globally' },
  { symbol: 'SHW', name: 'Sherwin-Williams', type: 'equity', category: 'sector_leader', description: 'Paint and coatings — largest in North America' },
  { symbol: 'ALB', name: 'Albemarle', type: 'equity', category: 'sector_leader', description: 'Lithium production — key EV battery material supplier' },

  // ── SECTOR LEADERS — Communication ───────────────────────────────────────
  { symbol: 'GOOGL', name: 'Alphabet (Google)', type: 'equity', category: 'sector_leader', description: 'Search, YouTube, Google Cloud, and AI (Gemini)' },
  { symbol: 'META', name: 'Meta Platforms', type: 'equity', category: 'sector_leader', description: 'Social media (Facebook, Instagram, WhatsApp) and AR/VR' },
  { symbol: 'NFLX', name: 'Netflix', type: 'equity', category: 'sector_leader', description: 'Streaming video — largest subscriber base globally' },
  { symbol: 'DIS', name: 'Walt Disney', type: 'equity', category: 'sector_leader', description: 'Media, theme parks, and streaming (Disney+)' },
  { symbol: 'CMCSA', name: 'Comcast', type: 'equity', category: 'sector_leader', description: 'Cable, broadband, NBCUniversal media' },
  { symbol: 'T', name: 'AT&T', type: 'equity', category: 'sector_leader', description: 'US telecom — wireless and fiber broadband' },

  // ── THEMATIC — AI / Semiconductors ───────────────────────────────────────
  { symbol: 'SMCI', name: 'Super Micro Computer', type: 'equity', category: 'thematic', description: 'AI server and rack-scale infrastructure for data centers' },
  { symbol: 'AMAT', name: 'Applied Materials', type: 'equity', category: 'thematic', description: 'Semiconductor equipment — deposition and etch tools' },
  { symbol: 'KLAC', name: 'KLA Corporation', type: 'equity', category: 'thematic', description: 'Semiconductor process control and inspection equipment' },
  { symbol: 'LRCX', name: 'Lam Research', type: 'equity', category: 'thematic', description: 'Semiconductor etch and deposition equipment' },
  { symbol: 'ASML', name: 'ASML', type: 'equity', category: 'thematic', description: 'EUV lithography equipment — monopoly on leading-edge chip printing' },
  { symbol: 'ARM', name: 'Arm Holdings', type: 'equity', category: 'thematic', description: 'CPU architecture IP — dominant in mobile and AI chips' },
  { symbol: 'INTC', name: 'Intel', type: 'equity', category: 'thematic', description: 'x86 CPUs and foundry services — turnaround story' },

  // ── THEMATIC — Cloud / Data ───────────────────────────────────────────────
  { symbol: 'CRM', name: 'Salesforce', type: 'equity', category: 'thematic', description: 'CRM SaaS and AI agents (Agentforce)' },
  { symbol: 'SNOW', name: 'Snowflake', type: 'equity', category: 'thematic', description: 'Cloud data warehouse and data sharing platform' },
  { symbol: 'DDOG', name: 'Datadog', type: 'equity', category: 'thematic', description: 'Cloud monitoring and observability platform' },
  { symbol: 'MDB', name: 'MongoDB', type: 'equity', category: 'thematic', description: 'NoSQL database — document-oriented cloud platform' },
  { symbol: 'NET', name: 'Cloudflare', type: 'equity', category: 'thematic', description: 'Edge network, CDN, security, and AI Workers platform' },

  // ── THEMATIC — Quantum ────────────────────────────────────────────────────
  { symbol: 'IONQ', name: 'IonQ', type: 'equity', category: 'thematic', description: 'Trapped-ion quantum computing company (public pure-play)' },
  { symbol: 'RGTI', name: 'Rigetti Computing', type: 'equity', category: 'thematic', description: 'Superconducting quantum computing — cloud QaaS' },
  { symbol: 'QUBT', name: 'Quantum Computing Inc.', type: 'equity', category: 'thematic', description: 'Quantum optimization and photonic computing' },
  { symbol: 'QBTS', name: 'D-Wave Quantum', type: 'equity', category: 'thematic', description: 'Quantum annealing systems and optimization cloud' },

  // ── THEMATIC — Nuclear / Uranium ──────────────────────────────────────────
  { symbol: 'CCJ', name: 'Cameco', type: 'equity', category: 'thematic', description: 'Largest publicly traded uranium producer (Athabasca Basin)' },
  { symbol: 'UEC', name: 'Uranium Energy Corp', type: 'equity', category: 'thematic', description: 'US-based uranium exploration and production' },
  { symbol: 'NXE', name: 'NexGen Energy', type: 'equity', category: 'thematic', description: 'Athabasca Basin uranium development (Rook I project)' },
  { symbol: 'UUUU', name: 'Energy Fuels', type: 'equity', category: 'thematic', description: 'US uranium and rare earth production' },
  { symbol: 'SMR', name: 'NuScale Power', type: 'equity', category: 'thematic', description: 'Small modular reactor (SMR) technology developer' },

  // ── THEMATIC — Space / Launch ─────────────────────────────────────────────
  { symbol: 'RKLB', name: 'Rocket Lab', type: 'equity', category: 'thematic', description: 'Small launch vehicles (Electron) and spacecraft components' },
  { symbol: 'ASTS', name: 'AST SpaceMobile', type: 'equity', category: 'thematic', description: 'Direct-to-cell satellite broadband constellation' },
  { symbol: 'KTOS', name: 'Kratos Defense', type: 'equity', category: 'thematic', description: 'Defense — unmanned systems, drones, and satellite tech' },
  { symbol: 'SPIR', name: 'Spire Global', type: 'equity', category: 'thematic', description: 'Earth observation satellites — weather, maritime, aviation data' },

  // ── THEMATIC — Defense / Drones ───────────────────────────────────────────
  { symbol: 'NOC', name: 'Northrop Grumman', type: 'equity', category: 'thematic', description: 'Defense — B-21 bomber, space systems, cyber' },
  { symbol: 'GD', name: 'General Dynamics', type: 'equity', category: 'thematic', description: 'Defense — Gulfstream jets, submarines, combat vehicles' },
  { symbol: 'AXON', name: 'Axon Enterprise', type: 'equity', category: 'thematic', description: 'Tasers, body cameras, drone tech, and law enforcement AI' },
  { symbol: 'HII', name: 'Huntington Ingalls', type: 'equity', category: 'thematic', description: 'US Navy shipbuilder — largest military shipbuilder in the US' },

  // ── THEMATIC — Fintech / Exchanges ────────────────────────────────────────
  { symbol: 'PYPL', name: 'PayPal', type: 'equity', category: 'thematic', description: 'Digital payments, Venmo, and checkout infrastructure' },
  { symbol: 'SQ', name: 'Block (Square)', type: 'equity', category: 'thematic', description: 'Payment processing, Cash App, and Bitcoin services' },
  { symbol: 'ICE', name: 'Intercontinental Exchange', type: 'equity', category: 'thematic', description: 'NYSE operator and derivatives exchange network' },
  { symbol: 'CME', name: 'CME Group', type: 'equity', category: 'thematic', description: 'World\'s largest derivatives exchange — futures and options' },
  { symbol: 'CBOE', name: 'Cboe Global Markets', type: 'equity', category: 'thematic', description: 'Options and volatility exchange (VIX products)' },
  { symbol: 'COIN', name: 'Coinbase', type: 'equity', category: 'thematic', description: 'Largest US crypto exchange and custody platform' },

  // ── THEMATIC — Energy Transition / Grid ──────────────────────────────────
  { symbol: 'ENPH', name: 'Enphase Energy', type: 'equity', category: 'thematic', description: 'Solar microinverters and home energy storage systems' },
  { symbol: 'FSLR', name: 'First Solar', type: 'equity', category: 'thematic', description: 'Thin-film solar panel manufacturer — US-made utility-scale' },
  { symbol: 'PLUG', name: 'Plug Power', type: 'equity', category: 'thematic', description: 'Hydrogen fuel cells and green hydrogen infrastructure' },
  { symbol: 'BE', name: 'Bloom Energy', type: 'equity', category: 'thematic', description: 'Solid oxide fuel cells for distributed power generation' },
  { symbol: 'ARRY', name: 'Array Technologies', type: 'equity', category: 'thematic', description: 'Solar tracker systems for utility-scale solar farms' },
  { symbol: 'GEV', name: 'GE Vernova', type: 'equity', category: 'thematic', description: 'Power generation — wind turbines, grid equipment, electrification' },
  { symbol: 'HASI', name: 'HA Sustainable Infrastructure', type: 'equity', category: 'thematic', description: 'Clean energy project finance and climate solutions' },
];
