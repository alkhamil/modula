/* eslint-disable @typescript-eslint/no-explicit-any */
import { type ReactNode } from 'react';
import {
  Controller,
  useFormContext,
  type ControllerFieldState,
  type ControllerRenderProps,
  type FieldValues,
  type Path,
  type UseFormReturn,
} from 'react-hook-form';
import { QuestionCircle } from '../icons';
import Tooltip from './Tooltip';

type LabelFontWeight = 'light' | 'normal' | 'medium' | 'semibold' | 'bold';

const LABEL_FONT_WEIGHTS: Record<LabelFontWeight, string> = {
  light: 'font-light',
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

type FormItemChildren<TForm extends FieldValues> =
  | ReactNode
  | ((args: {
      field: ControllerRenderProps<TForm>;
      fieldState: ControllerFieldState;
    }) => ReactNode);

interface FormItemProps<TForm extends FieldValues, TComponent extends React.ElementType> {
  name?: Path<TForm>;
  component?: TComponent;
  renderComponent?: (methods: UseFormReturn<TForm>) => ReactNode;
  rules?: Record<string, any>;
  label?: string;
  /** Teks penjelasan di bawah label (Figma "Description"). */
  description?: ReactNode;
  required?: boolean;
  layout?: 'vertical' | 'horizontal';
  labelWidth?: string;
  labelTooltip?: ReactNode;
  labelFontWeight?: LabelFontWeight;
  align?: 'center' | 'start';
  children?: FormItemChildren<TForm>;
  className?: string;
  testId?: string;
}

function FormItem<TForm extends FieldValues, TComponent extends React.ElementType>(
  props: FormItemProps<TForm, TComponent> &
    Partial<Omit<React.ComponentProps<TComponent>, keyof FormItemProps<TForm, TComponent>>>,
) {
  const {
    name,
    component: Component,
    renderComponent,
    rules,
    label,
    description,
    required: explicitRequired,
    layout = 'vertical',
    labelWidth = 'w-64',
    labelTooltip,
    labelFontWeight = 'medium',
    align = 'start',
    children,
    className = '',
    testId,
    ...rest
  } = props;
  const methods = useFormContext<TForm>();
  const { control } = methods;
  const componentTestId = testId ?? (rest as { 'data-testid'?: string })['data-testid'];

  const isRequired =
    explicitRequired ?? (typeof rules?.required === 'string' || rules?.required === true);

  // Label WDS: Medium 14/20 (token Label text), tanda wajib `*` merah; `labelFontWeight` lain menimpa.
  const weightClass = labelFontWeight === 'medium' ? '' : LABEL_FONT_WEIGHTS[labelFontWeight];

  const renderLabel = () => {
    if (!label && !description) return null;

    const labelContent = label ? (
      <>
        {label}
        {labelTooltip && (
          <Tooltip content={labelTooltip}>
            <QuestionCircle className="h-4 w-4 cursor-pointer" />
          </Tooltip>
        )}
        {isRequired && <span className="wds-form-item__mandatory">*</span>}
      </>
    ) : null;

    return (
      <div className="wds-form-item__label-group">
        {labelContent &&
          (name ? (
            <label htmlFor={name} className={`wds-form-item__label ${weightClass}`}>
              {labelContent}
            </label>
          ) : (
            <span className={`wds-form-item__label ${weightClass}`}>{labelContent}</span>
          ))}
        {description && <p className="wds-form-item__description">{description}</p>}
      </div>
    );
  };

  const renderContent = (): ReactNode => {
    if (renderComponent) return renderComponent(methods);

    if (typeof children === 'function') {
      if (!name) return null;

      return (
        <Controller
          control={control}
          name={name}
          rules={rules}
          render={({ field, fieldState }) => (children as any)({ field, fieldState })}
        />
      );
    }

    if (children) return children;

    if (name && Component) {
      return (
        <Controller
          control={control}
          name={name}
          rules={rules}
          render={({ field, fieldState }) => (
            <Component
              {...field}
              {...(rest as any)}
              id={name}
              data-testid={componentTestId}
              error={fieldState.error?.message}
            />
          )}
        />
      );
    }

    return null;
  };

  if (layout === 'horizontal') {
    return (
      <div
        data-testid={testId ? `${testId}-field` : undefined}
        data-layout="horizontal"
        className={`wds-form-item ${align === 'start' ? 'items-start' : 'items-center'} ${className}`}
      >
        <div className={`${labelWidth} shrink-0`}>{renderLabel()}</div>
        <div className="min-w-0 flex-1">{renderContent()}</div>
      </div>
    );
  }

  return (
    <div data-testid={testId ? `${testId}-field` : undefined} data-layout="vertical" className={`wds-form-item ${className}`}>
      {renderLabel()}
      {renderContent()}
    </div>
  );
}

export default FormItem;
