import React, { useEffect, useState } from 'react';
import {
  TrendingUp, Package, Users, ShoppingBag,
  BarChart2, ArrowUpRight,
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import AdminLayout from './AdminLayout';
import { adminGetStats } from '../../services/productService';

// Enregistrer les composants Chart.js nécessaires
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminGetStats()
      .then((res) => setStats(res.data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <AdminLayout>
      <div className="flex justify-center items-center h-64 text-gray-400 gap-2">
        <BarChart2 size={20} className="animate-pulse" /> Chargement...
      </div>
    </AdminLayout>
  );

  const kpis = [
    {
      label: "Chiffre d'affaires",
      value: `${Number(stats?.chiffre_affaires ?? 0).toLocaleString('fr-MA')} DH`,
      icon:  TrendingUp,
      color: 'text-green-500',
    },
    {
      label: 'Commandes',
      value: stats?.total_commandes ?? 0,
      icon:  ShoppingBag,
      color: 'text-blue-500',
    },
    {
      label: 'Clients',
      value: stats?.total_clients ?? 0,
      icon:  Users,
      color: 'text-purple-500',
    },
    {
      label: 'Produits',
      value: stats?.total_produits ?? 0,
      icon:  Package,
      color: 'text-amber-500',
    },
  ];

  // Données pour Chart.js
  const chartData = stats?.revenues_mensuels ?? [];

  const data = {
    labels: chartData.map((d) => d.mois),
    datasets: [
      {
        label: 'Revenus (DH)',
        data: chartData.map((d) => d.total),
        fill: true,
        borderColor: '#22c55e',
        borderWidth: 2.5,
        backgroundColor: (ctx) => {
          const canvas = ctx.chart.ctx;
          const gradient = canvas.createLinearGradient(0, 0, 0, 260);
          gradient.addColorStop(0,   'rgba(34,197,94,0.18)');
          gradient.addColorStop(1,   'rgba(34,197,94,0)');
          return gradient;
        },
        pointBackgroundColor: '#22c55e',
        pointBorderColor:     '#fff',
        pointBorderWidth:     2,
        pointRadius:          4,
        pointHoverRadius:     6,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#fff',
        titleColor:      '#94a3b8',
        bodyColor:       '#16a34a',
        bodyFont:        { weight: 'bold', size: 13 },
        borderColor:     '#e2e8f0',
        borderWidth:     1,
        padding:         12,
        callbacks: {
          label: (ctx) => ` ${ctx.parsed.y.toLocaleString('fr-MA')} DH`,
        },
      },
    },
    scales: {
      x: {
        grid:      { display: false },
        border:    { display: false },
        ticks:     { color: '#94a3b8', font: { size: 11 } },
      },
      y: {
        grid:      { color: '#f1f5f9', drawBorder: false },
        border:    { display: false, dash: [4, 4] },
        ticks: {
          color: '#94a3b8',
          font:  { size: 11 },
          callback: (v) => `${(v / 1000).toFixed(0)}k`,
        },
      },
    },
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Tableau de bord</h1>
        <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
          {new Date().toLocaleDateString('fr-FR', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
          })}
        </span>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpis.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4"
          >
            <Icon size={28} className={`flex-shrink-0 ${color}`} />
            <div className="min-w-0">
              <p className="text-xs text-gray-400 truncate">{label}</p>
              <p className="text-xl font-bold text-gray-800 truncate">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Revenue Chart ── */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              <TrendingUp size={18} className="text-green-500" />
              Revenus mensuels
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">12 derniers mois</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
            <ArrowUpRight size={14} />
            {Number(stats?.chiffre_affaires ?? 0).toLocaleString('fr-MA')} DH total
          </div>
        </div>

        {chartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-300 gap-2">
            <BarChart2 size={40} />
            <p className="text-sm">Aucune donnée disponible</p>
          </div>
        ) : (
          <div style={{ height: 260 }}>
            <Line data={data} options={options} />
          </div>
        )}
      </div>

      {/* ── Top produits ── */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <ShoppingBag size={16} className="text-blue-500" /> Top 5 produits vendus
        </h2>
        {!stats?.top_produits?.length ? (
          <div className="flex flex-col items-center justify-center h-24 text-gray-300 gap-1">
            <Package size={28} />
            <p className="text-xs">Aucune vente</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {stats.top_produits.map((item, i) => (
              <div key={item.produit_id} className="flex items-center gap-3">
                <span className="text-xs font-bold w-5 text-center flex-shrink-0 text-gray-400">
                  {i + 1}
                </span>
                <span className="flex-1 text-sm text-gray-700 truncate">
                  {item.produit?.nom_prduit ?? `Produit #${item.produit_id}`}
                </span>
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                  {item.total_vendu} vendus
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
