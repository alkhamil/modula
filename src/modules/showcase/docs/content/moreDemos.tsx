import { useState, type ComponentProps, type JSXElementConstructor } from 'react';
import {
  ActivityFeed,
  ActivityGauge,
  Avatar,
  BarLineChart,
  Calendar,
  Badge,
  Button,
  ChatInput,
  ChatMessage,
  CompactSelect,
  DropdownMenu,
  FeaturedIcon,
  IconWrapper,
  ImageCarousel,
  ImagePlaceholder,
  LabelText,
  Legend,
  ListItem,
  MenuItem,
  NavItem,
  OtpInput,
  PieChart,
  PinInput,
  Popover,
  QuantitySelector,
  RadarChart,
  ScrollArea,
  ScrollBar,
  FileUploadCard,
  UserCell,
  SectionHeader,
  useToast,
} from '../../../../shared/components/ui';
import { Database, Settings, InfoCircle, Pen, TrashBinTrash, Download } from '../../../../shared/components/icons';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type P<T extends JSXElementConstructor<any>> = Partial<ComponentProps<T>>;

export function CalendarDemo(props: P<typeof Calendar>) {
  const [value, setValue] = useState<Date | null>(new Date());
  return <Calendar {...props} value={value} onChange={setValue} />;
}

export function OtpInputDemo(props: P<typeof OtpInput>) {
  const [value, setValue] = useState('12');
  return <OtpInput {...props} value={value} onChange={setValue} aria-label="One-time code" />;
}

export function PinInputDemo(props: P<typeof PinInput>) {
  const [value, setValue] = useState('12');
  return <PinInput {...props} value={value} onChange={setValue} aria-label="PIN" />;
}

export function QuantitySelectorDemo(props: P<typeof QuantitySelector>) {
  const [value, setValue] = useState(2);
  return <QuantitySelector {...props} value={value} onChange={setValue} min={0} max={10} />;
}

export function LabelTextDemo(props: ComponentProps<typeof LabelText>) {
  return <LabelText {...props} />;
}

const REGIONS = [
  { value: 'id', label: 'Indonesia' },
  { value: 'sg', label: 'Singapore' },
  { value: 'my', label: 'Malaysia' },
];

export function CompactSelectDemo(props: P<typeof CompactSelect>) {
  const [value, setValue] = useState('id');
  return (
    <div className="h-48">
      <CompactSelect {...props} options={REGIONS} value={value} onChange={setValue} icon={<Settings />} aria-label="Region" />
    </div>
  );
}

export function DropdownMenuDemo(props: P<typeof DropdownMenu>) {
  return (
    <div className="h-56">
      <DropdownMenu
        {...props}
        trigger={() => <Button hierarchy="secondary">Actions</Button>}
        items={[
          { value: 'edit', label: 'Edit', description: 'Change details', icon: <Pen />, selected: true },
          { value: 'export', label: 'Export', icon: <Download /> },
          { value: 'archive', label: 'Archive', disabled: true },
          { value: 'delete', label: 'Delete', icon: <TrashBinTrash />, destructive: true },
        ]}
      />
    </div>
  );
}

export function ListItemDemo(props: P<typeof ListItem>) {
  return (
    <div className="w-[min(100%,380px)]">
      <ListItem
        title="Database"
        description="Primary instance"
        leading={<Database />}
        trailing={<Badge variant="success">Live</Badge>}
        onClick={() => {}}
        {...props}
      />
    </div>
  );
}

export function PopoverDemo(props: P<typeof Popover>) {
  return (
    <div className="h-64 pt-4">
      <Popover
        title="Invite teammates"
        description="Share access with people in your workspace."
        actions={
          <>
            <Button hierarchy="secondary" size="sm">
              Cancel
            </Button>
            <Button size="sm">Apply</Button>
          </>
        }
        {...props}
      >
        <Button hierarchy="secondary">Open popover</Button>
      </Popover>
    </div>
  );
}

export function ToastDemo({ variant = 'success', message = 'Changes saved' }: { variant?: 'success' | 'error' | 'warning' | 'info'; message?: string }) {
  const { showToast } = useToast();
  return <Button onClick={() => showToast({ message, variant })}>Show toast</Button>;
}

export function SectionHeaderDemo(props: P<typeof SectionHeader>) {
  return (
    <div className="w-full">
      <SectionHeader
        title="Team members"
        description="Manage who has access."
        titleAccessory={<Badge variant="primary">12</Badge>}
        actions={<Button size="sm">Invite</Button>}
        {...props}
      />
    </div>
  );
}

export function NavItemDemo(props: P<typeof NavItem>) {
  return (
    <div className={props.appearance === 'dark' ? 'w-64 bg-(--wds-bg-brand-pressed) p-2' : 'w-64'}>
      <NavItem label="Dashboard" icon={<Database />} badge={3} {...props} />
    </div>
  );
}

export function FeaturedIconDemo(props: P<typeof FeaturedIcon>) {
  return <FeaturedIcon icon={<InfoCircle />} {...props} />;
}

export function IconWrapperDemo(props: P<typeof IconWrapper>) {
  return <IconWrapper {...props}>{<Settings />}</IconWrapper>;
}

export function ImagePlaceholderDemo(props: P<typeof ImagePlaceholder>) {
  return <ImagePlaceholder width={220} {...props} />;
}

export function ImageCarouselDemo(props: P<typeof ImageCarousel>) {
  return (
    <div className="w-[min(100%,320px)]">
      <ImageCarousel
        {...props}
        slides={[1, 2, 3, 4].map((n) => (
          <ImagePlaceholder key={n} height={160} appearance="rounded" />
        ))}
      />
    </div>
  );
}

export function ScrollAreaDemo(props: P<typeof ScrollArea>) {
  return (
    <div className="w-[min(100%,320px)]">
      <ScrollArea maxHeight={140} {...props}>
        {Array.from({ length: 12 }, (_, i) => (
          <p key={i} className="py-1 text-sm text-(--wds-text-secondary)">
            Row {i + 1}
          </p>
        ))}
      </ScrollArea>
    </div>
  );
}

export function ActivityFeedDemo({ type = 'default', ...props }: P<typeof ActivityFeed> & { type?: 'default' | 'text' | 'file' | 'labels' | 'chat' }) {
  return (
    <div className="w-[min(100%,440px)]">
      <ActivityFeed
        {...props}
        items={[
          {
            name: 'Jane Doe',
            time: '00 mins ago',
            description: 'Description',
            online: true,
            type,
            file: { name: 'File name.format', size: 'File size' },
            labels: [<Badge key="a" variant="neutral">Label</Badge>, <Badge key="b" variant="info">Label</Badge>, <Badge key="c" variant="success" counter={12}>Label</Badge>],
            text: type === 'chat' ? "I'm message you right now." : '"Lorem ipsum dolor sit amet consectetur. Lorem ipsum dolor sit amet consectetur."',
          },
          { name: 'Budi Santoso', time: '5 mins ago', description: 'Description' },
        ]}
      />
    </div>
  );
}

export function ChatMessageDemo(props: P<typeof ChatMessage>) {
  return (
    <div className="w-[min(100%,360px)]">
      <ChatMessage message="Hi! Is the report ready?" name="Ayu" time="10:24" {...props} />
    </div>
  );
}

export function ChatInputDemo(props: P<typeof ChatInput>) {
  const [value, setValue] = useState('');
  return (
    <div className="w-[min(100%,420px)]">
      <ChatInput {...props} value={value} onChange={setValue} onSend={() => setValue('')} />
    </div>
  );
}

const MONTHS = [
  { label: 'Jan', value: 12 },
  { label: 'Feb', value: 19 },
  { label: 'Mar', value: 8 },
  { label: 'Apr', value: 24 },
  { label: 'May', value: 16 },
];

export function BarLineChartDemo({ multi, ...props }: P<typeof BarLineChart> & { multi?: boolean }) {
  return (
    <div className="w-[min(100%,480px)]">
      {multi ? (
        <BarLineChart
          labels={MONTHS.map((x) => x.label)}
          series={[
            { name: 'Orders', values: MONTHS.map((x) => x.value) },
            { name: 'Returns', values: MONTHS.map((x) => Math.round(x.value / 3)) },
          ]}
          {...props}
        />
      ) : (
        <BarLineChart data={MONTHS} seriesName="Orders" {...props} />
      )}
    </div>
  );
}

export function PieChartDemo(props: P<typeof PieChart>) {
  return (
    <PieChart
      data={[
        { label: 'Active', value: 52 },
        { label: 'Pending', value: 28 },
        { label: 'Closed', value: 20 },
      ]}
      {...props}
    />
  );
}

export function RadarChartDemo(props: P<typeof RadarChart>) {
  return (
    <RadarChart
      axes={['Speed', 'Quality', 'Cost', 'Support', 'Scale']}
      series={[
        { name: 'Team A', values: [8, 6, 7, 9, 5] },
        { name: 'Team B', values: [5, 8, 6, 6, 8] },
      ]}
      {...props}
    />
  );
}

export function ActivityGaugeDemo({ multi, ...props }: P<typeof ActivityGauge> & { multi?: boolean }) {
  return multi ? (
    <ActivityGauge
      rings={[
        { label: 'Move', value: 78 },
        { label: 'Exercise', value: 54 },
        { label: 'Stand', value: 32 },
      ]}
      size={180}
      {...props}
    />
  ) : (
    <ActivityGauge value={72} {...props} />
  );
}

export function LegendDemo(props: P<typeof Legend>) {
  return (
    <Legend
      items={[
        { label: 'Orders', color: 'var(--wds-primary-500)' },
        { label: 'Returns', color: 'var(--wds-primary-300)' },
        { label: 'Refunds', color: 'var(--wds-warning-500)' },
      ]}
      {...props}
    />
  );
}

// Avatar re-export supaya import tidak dianggap tak terpakai bila demo avatar dipakai di sini.
export { Avatar };

export function MenuItemDemo(props: P<typeof MenuItem>) {
  return (
    <div className="w-[min(100%,280px)]">
      <MenuItem label="Menu item" description="Optional supporting text" leading={<Pen />} trailing={<Download />} {...props} />
    </div>
  );
}

export function ScrollBarDemo(props: P<typeof ScrollBar>) {
  const [value, setValue] = useState(20);
  return <ScrollBar {...props} value={value} onChange={setValue} aria-label="Scroll position" />;
}

export function FileUploadCardDemo(props: P<typeof FileUploadCard>) {
  return (
    <div className="w-[min(100%,420px)]">
      <FileUploadCard name="Tech design requirements.pdf" size="200 KB" progress={80} onRemove={() => {}} onRetry={() => {}} {...props} />
    </div>
  );
}

export function UserCellDemo(props: P<typeof UserCell>) {
  return <UserCell name="Olivia Rhye" supporting="olivia@example.com" {...props} />;
}
