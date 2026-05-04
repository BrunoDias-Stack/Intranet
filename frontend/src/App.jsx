import React, { useEffect, useState } from 'react';
const api='http://localhost:4000/api';
export default function App(){
  const [tab,setTab]=useState('dashboard'); const [dashboard,setDashboard]=useState({warnings:[]}); const [projects,setProjects]=useState([]); const [investors,setInvestors]=useState([]);
  const load=async()=>{ setDashboard(await (await fetch(`${api}/dashboard`)).json()); setProjects(await (await fetch(`${api}/projects`)).json()); setInvestors(await (await fetch(`${api}/investors`)).json()); };
  useEffect(()=>{load();},[]);
  return <div className='layout'><aside><h2>Real Estate Admin</h2><button onClick={()=>setTab('dashboard')}>Dashboard</button><button onClick={()=>setTab('projects')}>Projects</button><button onClick={()=>setTab('investors')}>Investors</button></aside><main>
    {tab==='dashboard'&&<section><h1>Dashboard</h1><div className='cards'>{card('Capital Raised',dashboard.totalCapitalRaised)}{card('Active Projects',dashboard.totalActiveProjects)}{card('Estimated Profit',dashboard.totalEstimatedProfit)}{card('Avg ROI %',dashboard.averageROI?.toFixed(2))}{card('Open Risks',dashboard.openRisks)}{card('Delayed Stages',dashboard.delayedStages)}</div><h3>Alerts</h3>{dashboard.warnings.map((w,i)=><p className='warn' key={i}>{w}</p>)}</section>}
    {tab==='projects'&&<section><h1>Projects</h1><table><thead><tr><th>Name</th><th>Status</th><th>Type</th><th>Purchase</th><th>Sale Est.</th></tr></thead><tbody>{projects.map(p=><tr key={p.id}><td>{p.name}</td><td><span className='badge'>{p.status}</span></td><td>{p.type}</td><td>{p.purchasePrice}</td><td>{p.estimatedSalePrice}</td></tr>)}</tbody></table></section>}
    {tab==='investors'&&<section><h1>Investors</h1><table><thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Document</th></tr></thead><tbody>{investors.map(i=><tr key={i.id}><td>{i.name}</td><td>{i.email}</td><td>{i.phone}</td><td>{i.documentNumber}</td></tr>)}</tbody></table></section>}
  </main></div>
}
const card=(label,val)=><div className='card'><small>{label}</small><strong>{val??0}</strong></div>
