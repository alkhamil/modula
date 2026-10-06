import { useParams, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Button, DetailCard } from '../../../shared/components/ui';
import { useAuth } from '../../../app/providers';
import { useInvoiceForm } from '../hooks';
import { InvoicePermissions } from '../permissions';

function InvoiceViewPage() {
  const { t } = useTranslation();
  const { invoiceId } = useParams<{ invoiceId: string }>();
  const navigate = useNavigate();
  const { can } = useAuth();
  const { queryStatus, queryMessage, errorType, detailRows } = useInvoiceForm(invoiceId);

  return (
    <div data-testid="invoice-view-page" className="flex min-h-full flex-col stack-gap">
      <DetailCard
        testId="invoice-detail-card"
        title={t('runtime.detailTitle', { singular: t('invoice.label') })}
        state={{ status: queryStatus, message: queryMessage, rows: detailRows, errorType }}
      />
      {queryStatus !== 'error' && (
        <div className="flex justify-end gap-4">
          <Button
            data-testid="invoice-back-button"
            className="w-30"
            variant="secondary"
            onClick={() => navigate(-1)}
          >
            {t('common.back')}
          </Button>
          {can(InvoicePermissions.update) && (
            <Button
              data-testid="invoice-edit-button"
              className="w-30"
              variant="primary"
              onClick={() => navigate(`/invoices/${invoiceId}/edit`)}
            >
              {t('common.edit')}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default InvoiceViewPage;
