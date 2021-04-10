import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import { UrlObject } from 'node:url';

export interface NewWindowLinkProps {
  children: React.ReactNode;
  className?: string;
  href: string | UrlObject;
}

export const NewWindowLink = ({ children, className, href }: NewWindowLinkProps): JSX.Element => {
  const { t } = useTranslation();
  return (
    <Link href={href} passHref>
      <a target="_blank" rel="noreferrer" className={className ?? ''}>
        {children}
        {'\u00A0'}
        <i className="fas fa-external-link-square-alt"></i>
        <span className="sr-only">{t('common:launching-new-window')}</span>
      </a>
    </Link>
  );
};
