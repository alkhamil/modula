import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router';
import DocPage from '../docs/DocPage';
import DocsLayout from '../docs/DocsLayout';
import { findDoc } from '../docs/registry';

/** Halaman dokumentasi satu komponen (`/components/:slug`). */
function ComponentDocPage() {
  const { t } = useTranslation();
  const { slug } = useParams();
  const doc = findDoc(slug);
  return (
    <DocsLayout>
      {doc ? (
        <DocPage key={doc.slug} doc={doc} />
      ) : (
        <p className="text-xs text-muted-foreground">
          {t('docs.notFound.message', { slug })}{' '}
          <Link to="/components" className="text-primary underline">
            {t('docs.notFound.viewAll')}
          </Link>
        </p>
      )}
    </DocsLayout>
  );
}

export default ComponentDocPage;
