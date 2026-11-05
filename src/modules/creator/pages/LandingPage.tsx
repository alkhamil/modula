import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Badge, Button, Card } from '../../../shared/components/ui';
import {
  AddCircle,
  CheckCircle,
  CheckSquare,
  Database,
  Layers,
  Settings,
  UsersGroupRounded,
} from '../../../shared/components/icons';

const HIGHLIGHTS = [
  { key: 'auth', Icon: CheckSquare },
  { key: 'modules', Icon: UsersGroupRounded },
  { key: 'generator', Icon: Settings },
  { key: 'ds', Icon: Database },
] as const;

const WORKFLOW_STEPS = ['s1', 's2', 's3', 's4'] as const;

/** Halaman beranda Modula bergaya web end-user. */
function LandingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-12 py-4" data-testid="landing-page">
      <section className="flex flex-col items-center rounded-2xl border border-border bg-surface px-6 py-12 text-center sm:px-12 sm:py-16">
        <Badge variant="primary" size="md">
          {t('creator.landing.badge')}
        </Badge>
        <h1 className="mt-5 max-w-3xl text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {t('creator.landing.title')}
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          {t('creator.landing.subtitle')}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button
            size="lg"
            leadingIcon={<AddCircle className="h-5 w-5" />}
            onClick={() => navigate('/create')}
            testId="landing-create-btn"
          >
            {t('creator.landing.startWizard')}
          </Button>
          <Button
            size="lg"
            hierarchy="secondary"
            leadingIcon={<Layers className="h-5 w-5" />}
            onClick={() => navigate('/components')}
            testId="landing-docs-btn"
          >
            {t('creator.landing.exploreDocs')}
          </Button>
        </div>
      </section>

      <section className="flex flex-col stack-gap">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold text-foreground">{t('creator.landing.highlightsTitle')}</h2>
          <p className="text-sm text-muted-foreground">{t('creator.landing.highlightsSubtitle')}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {HIGHLIGHTS.map(({ key, Icon }) => (
            <Card key={key} testId={`landing-card-${key}`}>
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="flex flex-col gap-1">
                  <h3 className="text-base font-semibold text-foreground">
                    {t(`creator.landing.cards.${key}Title`)}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {t(`creator.landing.cards.${key}Desc`)}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="flex flex-col stack-gap">
        <h2 className="text-xl font-semibold text-foreground">{t('creator.landing.workflowTitle')}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {WORKFLOW_STEPS.map((step) => (
            <Card key={step} testId={`landing-step-${step}`}>
              <div className="flex flex-col gap-2">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <CheckCircle className="h-4 w-4" />
                </span>
                <h3 className="text-sm font-semibold text-foreground">
                  {t(`creator.landing.workflowSteps.${step}Title`)}
                </h3>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {t(`creator.landing.workflowSteps.${step}Desc`)}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
