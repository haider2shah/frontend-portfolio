interface SectionHeadProps {
  num: string;
  title: string;
  titleId: string;
  lede?: string;
}

export default function SectionHead({ num, title, titleId, lede }: SectionHeadProps) {
  return (
    <div className="section-head reveal">
      <span className="num">{num}</span>
      <h2 id={titleId}>{title}</h2>
      {lede ? <p className="lede">{lede}</p> : null}
    </div>
  )
}
