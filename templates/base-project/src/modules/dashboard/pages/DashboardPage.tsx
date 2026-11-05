import { useTranslation } from 'react-i18next';
import { Alert, Card } from '../../../shared/components/ui';
import { projectConfig } from '../../../app/project.config';
import { useAuth } from '../../../app/providers';

/** Halaman awal project: sambutan + langkah berikutnya. */
function DashboardPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  return (
    <div className="flex flex-col stack-gap" data-testid="dashboard-page">
      <Card title={t('dashboard.welcomeTitle', { name: projectConfig.name })}>
        <p className="text-sm text-muted-foreground">
          {t('dashboard.welcomeDescription', { user: user?.name ?? '' })}
        </p>
      </Card>
      <Alert variant="info" message={t('dashboard.nextSteps')} />
    </div>
  );
}

export default DashboardPage;
