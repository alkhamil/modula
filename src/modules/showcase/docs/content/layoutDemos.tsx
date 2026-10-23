import { useState, type ComponentProps } from 'react';
import {
  Accordion,
  Avatar,
  Badge,
  Banner,
  Breadcrumbs,
  Divider,
  Link,
  Progress,
  Rating,
  SearchBar,
  SegmentedControl,
  Slider,
  Stepper,
  Tabs,
} from '../../../../shared/components/ui';
import { PageHeader, Profile, SideNavbar } from '../../../../shared/components/layout';
import { Database, Settings, UsersGroupRounded } from '../../../../shared/components/icons';

export function AvatarDemo(props: ComponentProps<typeof Avatar>) {
  return <Avatar {...props} />;
}

export function PageHeaderDemo(props: Omit<ComponentProps<typeof PageHeader>, 'title'> & { title?: string; showProfile?: boolean }) {
  const { showProfile = true, ...rest } = props;
  return (
    <div className="h-[22rem] min-w-0 max-w-[760px] flex-1 self-start border-y border-(--wds-stroke-subtle)">
      <PageHeader
        {...rest}
        title={rest.title ?? 'Page Name'}
        breadcrumb={[{ label: 'Dashboard', path: '/' }, { label: 'Feature Name', path: '/' }, { label: 'Add Company' }]}
      >
        {showProfile && <Profile user={{ name: 'Mikel Hasan', roleName: 'Superadmin' }} onLogout={() => {}} />}
      </PageHeader>
    </div>
  );
}

export function ProfileDemo(props: Partial<ComponentProps<typeof Profile>>) {
  return (
    <div className="flex h-64 w-full justify-center">
      <Profile {...props} user={{ name: 'Ayu Lestari', roleName: 'Admin' }} onLogout={() => {}} />
    </div>
  );
}

const ITEMS = [
  { label: 'Dashboard', path: '/', icon: <Database /> },
  {
    label: 'Users',
    icon: <UsersGroupRounded />,
    children: [
      { label: 'Users', path: '/user-management/users' },
      { label: 'Roles', path: '/user-management/roles' },
    ],
  },
  { label: 'Settings', path: '/settings', icon: <Settings /> },
];

/** Demo SideNavbar: `transform` membuat posisi fixed relatif terhadap kotak ini. */
export function SideNavbarDemo(props: Partial<ComponentProps<typeof SideNavbar>>) {
  const [collapsed, setCollapsed] = useState(props.collapsed ?? false);
  return (
    <div className="relative h-[320px] w-full overflow-hidden rounded-lg [transform:translateZ(0)]">
      <SideNavbar
        items={ITEMS}
        appName="Modula"
        mobileOpen={false}
        onMobileClose={() => {}}
        {...props}
        collapsed={props.collapsed ?? collapsed}
        onToggle={() => setCollapsed((v) => !v)}
      />
    </div>
  );
}

const TAB_ITEMS = [
  { value: 'overview', label: 'Overview' },
  { value: 'members', label: 'Members', badge: 3 },
  { value: 'settings', label: 'Settings' },
  { value: 'archived', label: 'Archived', disabled: true },
];

/** Demo Tabs: tab terpilih dikelola di sini. */
export function TabsDemo(props: Partial<ComponentProps<typeof Tabs>>) {
  const [value, setValue] = useState('overview');
  return (
    <div className="w-full">
      <Tabs {...props} items={TAB_ITEMS} value={value} onChange={setValue} />
    </div>
  );
}

export function BreadcrumbsDemo(props: Partial<ComponentProps<typeof Breadcrumbs>>) {
  return (
    <Breadcrumbs
      {...props}
      items={[
        { label: 'Home', to: '/' },
        { label: 'Company', to: '/' },
        { label: 'Team', to: '/' },
        { label: 'Users', to: '/user-management/users' },
        { label: 'Detail' },
      ]}
    />
  );
}

export function LinkDemo(props: ComponentProps<typeof Link>) {
  return <Link {...props} href="#" onClick={(e) => e.preventDefault()} />;
}

export function DividerDemo(props: ComponentProps<typeof Divider>) {
  return (
    <div className={props.orientation === 'vertical' ? 'flex h-16 items-center' : 'w-full'}>
      <Divider {...props} />
    </div>
  );
}

const ACCORDION_ITEMS = [
  { value: 'a', title: 'What is Modula?', description: 'Platform overview', content: 'A dynamic module platform: modules are data, rendered at runtime.' },
  { value: 'b', title: 'How do I publish a module?', content: 'Use the generator wizard and press Publish.' },
  { value: 'c', title: 'Archived question', content: 'Not available.', disabled: true },
];

export function AccordionDemo(props: Partial<ComponentProps<typeof Accordion>>) {
  return (
    <div className="w-[min(100%,460px)]">
      <Accordion {...props} items={ACCORDION_ITEMS} defaultOpen={['a']} />
    </div>
  );
}

export function ProgressDemo(props: ComponentProps<typeof Progress>) {
  return (
    <div className="w-[min(100%,420px)]">
      <Progress {...props} />
    </div>
  );
}

export function BannerDemo(props: ComponentProps<typeof Banner>) {
  return (
    <div className="w-full">
      <Banner {...props} />
    </div>
  );
}

export function SearchBarDemo(props: Partial<ComponentProps<typeof SearchBar>>) {
  const [value, setValue] = useState('');
  return (
    <div className="w-[min(100%,360px)]">
      <SearchBar {...props} value={value} onChange={setValue} />
    </div>
  );
}

const STEPS = [
  { label: 'Step 1', title: 'Account', badge: <Badge variant="success">Success</Badge> },
  { label: 'Step 2', title: 'Details', badge: <Badge variant="info">In Progress</Badge> },
  { label: 'Step 3', title: 'Review', badge: <Badge variant="neutral">Pending</Badge> },
];

export function StepperDemo(props: Partial<ComponentProps<typeof Stepper>>) {
  return (
    <div className="w-[460px] max-w-none">
      <Stepper current={1} {...props} steps={STEPS} />
    </div>
  );
}

export function SliderDemo({
  range,
  ...props
}: { range?: boolean; size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'; disabled?: boolean }) {
  const [value, setValue] = useState(40);
  const [pair, setPair] = useState<[number, number]>([25, 70]);
  return (
    <div className="w-[min(100%,360px)]">
      {range ? (
        <Slider {...props} range value={pair} onChange={setPair} />
      ) : (
        <Slider {...props} value={value} onChange={setValue} aria-label="Volume" />
      )}
    </div>
  );
}

export function RatingDemo(props: Partial<ComponentProps<typeof Rating>> & { interactive?: boolean }) {
  const { interactive, ...rest } = props;
  const [value, setValue] = useState(3);
  return <Rating {...rest} value={value} onChange={interactive ? setValue : undefined} />;
}

const SEGMENTS = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year', disabled: true },
];

export function SegmentedControlDemo(props: Partial<ComponentProps<typeof SegmentedControl>>) {
  const [value, setValue] = useState('week');
  return <SegmentedControl {...props} options={SEGMENTS} value={value} onChange={setValue} />;
}
