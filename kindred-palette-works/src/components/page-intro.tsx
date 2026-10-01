export function PageIntro({ index, eyebrow, title, description }: { index: string; eyebrow: string; title: string; description: string }) {
  return <div className="page-intro page-container"><div className="section-kicker"><span>{index}</span><span>{eyebrow}</span></div><h1>{title}</h1><p>{description}</p></div>;
}
