import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const LME = () => {
  const [currency, setCurrency] = useState('BRL');
  const [data, setData] = useState({
    price: '—',
    unit: 'BRL/t',
    change: '—',
    hint: '—',
    timestamp: '—',
    loading: false
  });

  // API Configuration
  const API_KEY = '8570990866c048e:a9wrlb5jhurlxi1';
  const BASE = 'https://api.tradingeconomics.com';
  const FXPAIR = 'BRL:USD';

  const buildUrl = (path: string) => {
    const separator = path.includes('?') ? '&' : '?';
    return `${BASE}${path}${separator}c=${encodeURIComponent(API_KEY)}&f=json&_=${Date.now()}`;
  };

  const getJSON = async (url: string) => {
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) throw new Error('HTTP ' + response.status);
    return response.json();
  };

  const fetchAluminum = async () => {
    try {
      // Try search first
      const search = await getJSON(buildUrl('/markets/search/alumin'));
      const hit = (search || []).find((x: any) =>
        (x.Type || '').toLowerCase().includes('commodity') &&
        (x.Name || '').toLowerCase().includes('alumin')
      );
      if (hit && hit.Symbol) {
        const bySymbol = await getJSON(buildUrl(`/markets/symbol/${encodeURIComponent(hit.Symbol)}`));
        if (Array.isArray(bySymbol) && bySymbol.length) return bySymbol[0];
      }
    } catch (e) {
      console.warn('Search failed, trying commodities...', e);
    }

    // Fallback: search in commodities list
    const list = await getJSON(buildUrl('/markets/commodities'));
    const item = (list || []).find((x: any) => (x.Name || '').toLowerCase().includes('alumin'));
    if (!item) throw new Error('Aluminum not found in feed');
    return item;
  };

  const getUSDBRL = async () => {
    try {
      const fx = await getJSON(buildUrl(`/markets/currency/${FXPAIR}`));
      return Number(fx?.[0]?.Last || fx?.[0]?.Close || 0) || 0;
    } catch (e) {
      console.warn('FX fetch failed, keeping BRL', e);
      return 0;
    }
  };

  const formatPrice = (n: number, curr: string) => {
    return (curr === 'BRL' ? 'R$ ' : 'R$ ') + Number(n).toLocaleString('pt-BR', { maximumFractionDigits: 2 });
  };

  const loadData = async () => {
    try {
      setData(prev => ({ ...prev, timestamp: 'Atualizando…' }));

      const [item, usdbrl] = await Promise.all([fetchAluminum(), getUSDBRL()]);

      const priceUSDt = Number(item.Last ?? item.Close ?? 0);
      const chgPct = Number(item.DailyPercentualChange ?? item.DailyPercentageChange ?? 0);
      const dayHigh = Number(item.day_high ?? item.High ?? 0);
      const dayLow = Number(item.day_low ?? item.Low ?? 0);
      const updated = item.LastUpdate || item.Date || new Date().toISOString();

      const toBRL = currency === 'BRL' && usdbrl > 0;
      const price = toBRL ? priceUSDt * usdbrl : priceUSDt;

      setData({
        price: formatPrice(price, toBRL ? 'BRL' : 'BRL'),
        unit: toBRL ? 'BRL/t' : 'BRL/t',
        change: (chgPct >= 0 ? '+' : '') + chgPct.toFixed(2) + '%',
        hint: dayHigh && dayLow ? `Alta: ${dayHigh.toLocaleString('pt-BR')} | Baixa: ${dayLow.toLocaleString('pt-BR')}` : '—',
        timestamp: new Date(updated).toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        loading: false
      });
    } catch (e) {
      console.error(e);
      setData({
        price: '—',
        unit: currency === 'BRL' ? 'BRL/t' : 'BRL/t',
        change: '—',
        hint: 'Erro ao carregar dados',
        timestamp: '—',
        loading: false
      });
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, [currency]);

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrency(e.target.value);
  };

  const getChangeColor = () => {
    if (data.change === '—') return 'text-slate-400';
    return data.change.startsWith('+') ? 'text-green-400' : 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50">
        <Header />
        <Navigation />
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-8">
            LME - London Metal Exchange
          </h1>
          
          {/* Aluminum Widget */}
          <div 
            className="aluminum-widget"
            style={{
              '--bg': '#0f1115',
              '--muted': '#99a1b3',
              '--up': '#30d0a7',
              '--down': '#ff6b6b',
              background: 'var(--bg)',
              color: '#fff',
              border: '1px solid #1b1f2a',
              borderRadius: '14px',
              padding: '16px',
              fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Arial'
            } as React.CSSProperties}
          >
            <header className="flex justify-between items-center gap-3">
              <h3 className="text-lg font-semibold m-0">Alumínio (cotação agregada)</h3>
              <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--muted)' }}>
                <label className="flex items-center gap-2">
                  Moeda:
                  <select 
                    value={currency}
                    onChange={handleCurrencyChange}
                    style={{
                      background: '#0b0d12',
                      color: '#fff',
                      border: '1px solid #1b1f2a',
                      borderRadius: '8px',
                      padding: '4px 8px'
                    }}
                  >
                    <option value="BRL">BRL</option>
                    <option value="BRL">BRL</option>
                  </select>
                </label>
                <small>{data.timestamp}</small>
              </div>
            </header>

            <div 
              className="grid grid-cols-2 gap-3 mt-3"
            >
              <div 
                style={{
                  background: '#0b0d12',
                  border: '1px solid #1b1f2a',
                  borderRadius: '12px',
                  padding: '14px'
                }}
              >
                <div className="text-xs" style={{ color: 'var(--muted)' }}>Preço</div>
                <div 
                  className="text-3xl font-bold leading-tight mt-1"
                >
                  {data.price}
                </div>
                <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{data.unit}</div>
              </div>
              
              <div 
                style={{
                  background: '#0b0d12',
                  border: '1px solid #1b1f2a',
                  borderRadius: '12px',
                  padding: '14px'
                }}
              >
                <div className="text-xs" style={{ color: 'var(--muted)' }}>Variação (24h)</div>
                <div 
                  className="text-3xl font-bold leading-tight mt-1"
                  style={{ 
                    color: data.change.startsWith('+') ? 'var(--up)' : 
                           data.change.startsWith('-') ? 'var(--down)' : 'var(--muted)'
                  }}
                >
                  {data.change}
                </div>
                <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{data.hint}</div>
              </div>
            </div>

            <div className="mt-2 text-xs" style={{ color: 'var(--muted)' }}>
              Fonte: TradingEconomics (delay do provedor).
            </div>
          </div>

          <div className="mt-8 bg-card rounded-lg p-6 border">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Sobre o LME - London Metal Exchange
            </h2>
            <div className="prose prose-slate dark:prose-invert">
              <p className="text-muted-foreground mb-4">
                O London Metal Exchange (LME) é a principal bolsa mundial de metais não ferrosos, 
                estabelecida em 1877. É o centro global de negociação e formação de preços para 
                metais industriais.
              </p>
              <h3 className="text-lg font-medium text-foreground mb-2">Principais Características:</h3>
              <ul className="text-muted-foreground space-y-2">
                <li>• Maior volume de negociação de metais não ferrosos do mundo</li>
                <li>• Preços de referência globais para a indústria</li>
                <li>• Contratos futuros e opções para hedge de risco</li>
                <li>• Entrega física através de uma rede global de armazéns</li>
                <li>• Cotações em tempo real para alumínio, cobre, zinco, chumbo, níquel e estanho</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default LME;