import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const LME = () => {
  const [currency, setCurrency] = useState('USD');
  const [data, setData] = useState({
    price: '—',
    unit: 'USD/t',
    change: '—',
    hint: '—',
    timestamp: '—',
    loading: false
  });

  const API_KEY = '8570990866c048e:a9wrlb5jhurlxi1';
  const COMMS_URL = `https://api.tradingeconomics.com/markets/commodities?c=${API_KEY}&f=json`;
  const USD_BRL_URL = `https://api.tradingeconomics.com/markets/currency/USD:BRL?c=${API_KEY}&f=json`;

  const getJSON = async (url: string) => {
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) throw new Error('HTTP ' + response.status);
    return response.json();
  };

  const loadData = async () => {
    try {
      setData(prev => ({ ...prev, loading: true, timestamp: 'Atualizando…' }));
      
      const [commodities, fx] = await Promise.all([
        getJSON(COMMS_URL),
        getJSON(USD_BRL_URL)
      ]);

      const item = commodities.find((x: any) => (x.Name || '').toLowerCase().includes('alumin'));
      if (!item) {
        throw new Error('Alumínio não encontrado no feed');
      }

      let priceUSDt = Number(item.Last || item.Close || 0);
      const chgPct = Number(item.DailyPercentualChange || 0);
      const updated = item.LastUpdate || item.Date || new Date().toISOString();

      const usdbrl = Number(fx?.[0]?.Last || fx?.[0]?.Close || 0) || 0;
      const toBRL = currency === 'BRL';
      const price = toBRL ? priceUSDt * usdbrl : priceUSDt;

      setData({
        price: (toBRL ? 'R$ ' : 'US$ ') + price.toLocaleString('pt-BR', { maximumFractionDigits: 2 }),
        unit: toBRL ? 'BRL/t' : 'USD/t',
        change: (chgPct >= 0 ? '+' : '') + chgPct.toFixed(2) + '%',
        hint: `Alta: ${Number(item.High || 0).toLocaleString('pt-BR')} | Baixa: ${Number(item.Low || 0).toLocaleString('pt-BR')}`,
        timestamp: new Date(updated).toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        loading: false
      });
    } catch (error) {
      console.error(error);
      setData({
        price: '—',
        unit: currency === 'BRL' ? 'BRL/t' : 'USD/t',
        change: '—',
        hint: 'Erro ao carregar dados',
        timestamp: '—',
        loading: false
      });
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 60000); // atualiza a cada 60s
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
          
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 text-white">
            <header className="flex justify-between items-center gap-3 mb-4">
              <h3 className="text-lg font-semibold">Alumínio (TradingEconomics)</h3>
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <label className="flex items-center gap-2">
                  Moeda:
                  <select 
                    value={currency}
                    onChange={handleCurrencyChange}
                    className="bg-slate-800 text-white border border-slate-600 rounded-lg px-2 py-1"
                  >
                    <option value="USD">USD</option>
                    <option value="BRL">BRL</option>
                  </select>
                </label>
                <small>{data.timestamp}</small>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-slate-800 border border-slate-600 rounded-xl p-4">
                <div className="text-sm text-slate-400 mb-2">Preço</div>
                <div className="text-3xl font-bold leading-tight">{data.price}</div>
                <div className="text-sm text-slate-400 mt-1">{data.unit}</div>
              </div>
              
              <div className="bg-slate-800 border border-slate-600 rounded-xl p-4">
                <div className="text-sm text-slate-400 mb-2">Variação 24h</div>
                <div className={`text-3xl font-bold leading-tight ${getChangeColor()}`}>
                  {data.change}
                </div>
                <div className="text-sm text-slate-400 mt-1">{data.hint}</div>
              </div>
            </div>

            <div className="text-xs text-slate-400">
              Fonte: TradingEconomics (cotação agregada, atraso ~15min)
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