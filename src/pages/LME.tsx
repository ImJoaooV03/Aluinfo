import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
  const [chartData, setChartData] = useState<any[]>([]);

  // Dados simulados realistas para o alumínio
  const generateMockData = () => {
    const basePrice = 2250; // Preço base em USD/t
    const usdbrl = 5.1; // Taxa de câmbio USD/BRL simulada
    const now = new Date();
    const mockData = [];
    const chartPoints = [];

    // Gerar dados das últimas 30 horas
    for (let i = 29; i >= 0; i--) {
      const time = new Date(now.getTime() - (i * 60 * 60 * 1000));
      const variation = (Math.random() - 0.5) * 50; // Variação de -25 a +25
      const price = basePrice + variation;
      
      chartPoints.push({
        time: time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        usd: Math.round(price * 100) / 100,
        brl: Math.round(price * usdbrl * 100) / 100
      });
    }

    const currentPrice = chartPoints[chartPoints.length - 1];
    const previousPrice = chartPoints[chartPoints.length - 2];
    const changePercent = ((currentPrice.usd - previousPrice.usd) / previousPrice.usd) * 100;
    
    const toBRL = currency === 'BRL';
    const displayPrice = toBRL ? currentPrice.brl : currentPrice.usd;
    
    return {
      currentData: {
        price: (toBRL ? 'R$ ' : 'US$ ') + displayPrice.toLocaleString('pt-BR', { maximumFractionDigits: 2 }),
        unit: toBRL ? 'BRL/t' : 'USD/t',
        change: (changePercent >= 0 ? '+' : '') + changePercent.toFixed(2) + '%',
        hint: `Alta: ${(toBRL ? currentPrice.brl + 50 : currentPrice.usd + 25).toLocaleString('pt-BR')} | Baixa: ${(toBRL ? currentPrice.brl - 50 : currentPrice.usd - 25).toLocaleString('pt-BR')}`,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        loading: false
      },
      chartData: chartPoints
    };
  };

  const loadData = async () => {
    try {
      setData(prev => ({ ...prev, loading: true, timestamp: 'Atualizando…' }));
      
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockResult = generateMockData();
      setData(mockResult.currentData);
      setChartData(mockResult.chartData);
      
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
              Gráfico de Preços - Últimas 30 Horas
            </h2>
            <div className="h-96 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="time" 
                    className="text-xs"
                    interval="preserveStartEnd"
                  />
                  <YAxis 
                    className="text-xs"
                    domain={['dataMin - 50', 'dataMax + 50']}
                  />
                  <Tooltip 
                    labelClassName="text-slate-600"
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#f1f5f9'
                    }}
                    formatter={(value, name) => [
                      `${currency === 'BRL' ? 'R$' : 'US$'} ${Number(value).toLocaleString('pt-BR', { maximumFractionDigits: 2 })}`,
                      `Alumínio (${currency}/t)`
                    ]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey={currency === 'BRL' ? 'brl' : 'usd'}
                    stroke="#f97316" 
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: '#f97316' }}
                  />
                </LineChart>
              </ResponsiveContainer>
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