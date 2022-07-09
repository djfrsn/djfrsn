import { FooterType } from 'lib/types';

function Footer({ data }: { data: FooterType }) {
  return (
    <footer className="footer">
      {data.links && (
        <ul>
          {data.links.map(footerLink => {
            return <li>{footerLink.linkTitle}</li>
          })}
        </ul>
      )}
    </footer>
  )
}

export default Footer
