import useTranslation from 'next-translate/useTranslation';

export const LaunchingNewWindow = (): JSX.Element => {
  const { t } = useTranslation();
  return (
    <>
      <i className="fas fa-external-link-square-alt"></i>
      <span className="tw-sr-only">{t('common:launching-new-window')}</span>
    </>
  );
};
