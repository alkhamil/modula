/** Render satu field definisi menjadi FormItem — dipakai form runtime + kartu kanvas. */
import type { ReactNode } from 'react';
import { FormItem } from '../../../shared/components/ui';
import {
  Checkbox,
  CheckboxGroup,
  DatePicker,
  FileUpload,
  RadioButtonGroup,
  Select,
  Toggle,
  Textarea,
  InputField,
} from '../../../shared/components/ui/fields';
import type { GeneratorFieldConfig } from '../types';
import type { ModuleDefinition } from '../definitions';
import { moduleFieldLabel, moduleFieldPlaceholder } from './moduleI18n';
import { parseConfigDate, resolveFormItemLayout } from '../componentProps';
import type { DynamicOption } from './types';
import { fieldRulesToRHF, maxLengthOf } from './validation';
import type { LoadOptionsFn } from '../../../shared/components/ui/fields/Select';

export interface FieldRenderContext {
  def?: Pick<ModuleDefinition, 'i18n'>;
  testPrefix: string;
  optionsOf: (field: GeneratorFieldConfig) => DynamicOption[];
  loaderOf: (field: GeneratorFieldConfig) => LoadOptionsFn | undefined;
  /** Span grid 1–12; tanpa pilihan eksplisit, span sempit default vertikal. */
  span?: number;
}

export function renderDynamicField(
  field: GeneratorFieldConfig,
  ctx: FieldRenderContext,
): ReactNode {
  const testId = `${ctx.testPrefix}-${field.name}`;
  const itemProps = field.componentProps?.formItem;
  const common = {
    testId,
    name: field.name,
    rules: fieldRulesToRHF(field),
    layout: resolveFormItemLayout(itemProps?.layout, ctx.span),
    ...(itemProps?.labelWidth?.trim() ? { labelWidth: itemProps.labelWidth.trim() } : {}),
    ...(itemProps?.align ? { align: itemProps.align } : {}),
    ...(itemProps?.labelTooltip?.trim() ? { labelTooltip: itemProps.labelTooltip.trim() } : {}),
    ...(itemProps?.labelFontWeight ? { labelFontWeight: itemProps.labelFontWeight } : {}),
    ...(field.disabled === true ? { disabled: true as const } : {}),
  };
  const label = moduleFieldLabel(ctx.def, field);
  const lower = label.toLowerCase();
  const placeholderFor = (verb: string): string =>
    moduleFieldPlaceholder(ctx.def, field, `${verb} ${lower}`);
  const props = field.componentProps;
  switch (field.type) {
    case 'numberField': {
      const p = props?.text;
      return (
        <FormItem
          label={label}
          {...common}
          component={InputField}
          currency
          placeholder={placeholderFor('Enter')}
          {...(p?.size ? { size: p.size } : {})}
          {...(p?.clearable !== undefined ? { clearable: p.clearable } : {})}
          {...(p?.prefix?.trim() ? { prepend: p.prefix.trim() } : {})}
          {...(p?.suffix?.trim() ? { append: p.suffix.trim() } : {})}
        />
      );
    }
    case 'textareaField': {
      const p = props?.textarea;
      return (
        <FormItem
          label={label}
          {...common}
          component={Textarea}
          placeholder={placeholderFor('Enter')}
          {...(p?.size ? { size: p.size } : {})}
          {...(field.rows && field.rows > 0 ? { rows: field.rows } : {})}
        />
      );
    }
    case 'dateField': {
      const p = props?.date;
      const minDate = parseConfigDate(p?.minDate);
      const maxDate = parseConfigDate(p?.maxDate);
      return (
        <FormItem
          label={label}
          {...common}
          component={DatePicker}
          placeholder={placeholderFor('Select')}
          {...(p?.size ? { size: p.size } : {})}
          {...(p?.showTime !== undefined ? { showTime: p.showTime } : {})}
          {...(p?.clearable !== undefined ? { clearable: p.clearable } : {})}
          {...(minDate ? { minDate } : {})}
          {...(maxDate ? { maxDate } : {})}
        />
      );
    }
    case 'dateRangeField': {
      const p = props?.dateRange;
      const maxDate = parseConfigDate(p?.maxDate);
      return (
        <FormItem
          label={label}
          {...common}
          component={DatePicker}
          range
          placeholder={placeholderFor('Select')}
          {...(p?.size ? { size: p.size } : {})}
          {...(maxDate ? { maxDate } : {})}
          {...(p?.maxRangeDays ? { maxRangeDays: p.maxRangeDays } : {})}
        />
      );
    }
    case 'selectField': {
      const p = props?.select;
      const loader = ctx.loaderOf(field);
      if (loader) {
        return (
          <FormItem
            label={label}
            {...common}
            component={Select}
            placeholder={placeholderFor('Select')}
            searchable={p?.searchable ?? true}
            paginateOnScroll={p?.paginateOnScroll ?? true}
            loadOptions={loader}
            {...(p?.size ? { size: p.size } : {})}
            {...(p?.clearable !== undefined ? { clearable: p.clearable } : {})}
            {...(p?.pageSize ? { pageSize: p.pageSize } : {})}
            {...(p?.emptyOptionsText?.trim() ? { emptyOptionsText: p.emptyOptionsText.trim() } : {})}
            {...(p?.showSelectedOptions !== undefined
              ? { showSelectedOptions: p.showSelectedOptions }
              : {})}
            {...(p?.showValueOnly !== undefined ? { showValueOnly: p.showValueOnly } : {})}
          />
        );
      }
      return (
        <FormItem
          label={label}
          {...common}
          component={Select}
          placeholder={placeholderFor('Select')}
          options={ctx.optionsOf(field)}
          clearable={p?.clearable ?? false}
          searchable={p?.searchable ?? true}
          {...(p?.size ? { size: p.size } : {})}
          {...(p?.emptyOptionsText?.trim() ? { emptyOptionsText: p.emptyOptionsText.trim() } : {})}
          {...(p?.showSelectedOptions !== undefined
            ? { showSelectedOptions: p.showSelectedOptions }
            : {})}
          {...(p?.showValueOnly !== undefined ? { showValueOnly: p.showValueOnly } : {})}
        />
      );
    }
    case 'selectMultipleField': {
      const p = props?.selectMultiple;
      const loader = ctx.loaderOf(field);
      if (loader) {
        return (
          <FormItem
            label={label}
            {...common}
            component={Select}
            multiple
            placeholder={placeholderFor('Select')}
            searchable={p?.searchable ?? true}
            paginateOnScroll={p?.paginateOnScroll ?? true}
            loadOptions={loader}
            {...(p?.size ? { size: p.size } : {})}
            {...(p?.clearable !== undefined ? { clearable: p.clearable } : {})}
            {...(p?.pageSize ? { pageSize: p.pageSize } : {})}
            {...(p?.emptyOptionsText?.trim() ? { emptyOptionsText: p.emptyOptionsText.trim() } : {})}
            {...(p?.showSelectedOptions !== undefined
              ? { showSelectedOptions: p.showSelectedOptions }
              : {})}
            {...(p?.chipsSummary !== undefined ? { chipsSummary: p.chipsSummary } : {})}
            {...(p?.closeOnSelect !== undefined ? { closeOnSelect: p.closeOnSelect } : {})}
            {...(p?.hideCheckBox !== undefined ? { hideCheckBox: p.hideCheckBox } : {})}
          />
        );
      }
      return (
        <FormItem
          label={label}
          {...common}
          component={Select}
            multiple
          placeholder={placeholderFor('Select')}
          options={ctx.optionsOf(field)}
          searchable={p?.searchable ?? true}
          {...(p?.size ? { size: p.size } : {})}
          {...(p?.clearable !== undefined ? { clearable: p.clearable } : {})}
          {...(p?.emptyOptionsText?.trim() ? { emptyOptionsText: p.emptyOptionsText.trim() } : {})}
          {...(p?.showSelectedOptions !== undefined
            ? { showSelectedOptions: p.showSelectedOptions }
            : {})}
          {...(p?.chipsSummary !== undefined ? { chipsSummary: p.chipsSummary } : {})}
          {...(p?.closeOnSelect !== undefined ? { closeOnSelect: p.closeOnSelect } : {})}
          {...(p?.hideCheckBox !== undefined ? { hideCheckBox: p.hideCheckBox } : {})}
        />
      );
    }
    case 'radioGroupField': {
      const p = props?.radio;
      return (
        <FormItem
          label={label}
          {...common}
          component={RadioButtonGroup}
          options={ctx.optionsOf(field)}
          {...(p?.size ? { size: p.size } : {})}
        />
      );
    }
    case 'checkboxField': {
      const p = props?.checkbox;
      return (
        <FormItem
          label={label}
          {...common}
          component={Checkbox}
          {...(p?.size ? { size: p.size } : {})}
          {...(p?.indeterminate !== undefined ? { indeterminate: p.indeterminate } : {})}
        />
      );
    }
    case 'checkboxGroupField': {
      const p = props?.checkboxGroup;
      return (
        <FormItem
          label={label}
          {...common}
          component={CheckboxGroup}
          options={ctx.optionsOf(field)}
          {...(p?.size ? { size: p.size } : {})}
        />
      );
    }
    case 'switchField': {
      const p = props?.switch;
      return (
        <FormItem
          label={label}
          {...common}
          component={Toggle}
          showCheckedLabels={p?.showCheckedLabels ?? false}
          {...(p?.size ? { size: p.size } : {})}
          {...(p?.checkedLabel?.trim() ? { checkedLabel: p.checkedLabel.trim() } : {})}
          {...(p?.uncheckedLabel?.trim() ? { uncheckedLabel: p.uncheckedLabel.trim() } : {})}
        />
      );
    }
    case 'fileUploadField': {
      const p = props?.upload;
      return (
        <FormItem
          label={label}
          {...common}
          component={FileUpload}
          {...(p?.size ? { size: p.size } : {})}
          {...(p?.multiple !== undefined ? { multiple: p.multiple } : {})}
          {...(field.accept?.trim() ? { accept: field.accept.trim() } : {})}
        />
      );
    }
    case 'textField':
    default: {
      const maxLength = maxLengthOf(field);
      const p = props?.text;
      return (
        <FormItem
          label={label}
          {...common}
          component={InputField}
          {...(maxLength !== null ? { maxLength } : {})}
          placeholder={placeholderFor('Enter')}
          {...(p?.size ? { size: p.size } : {})}
          {...(p?.clearable !== undefined ? { clearable: p.clearable } : {})}
          {...(p?.prefix?.trim() ? { prepend: p.prefix.trim() } : {})}
          {...(p?.suffix?.trim() ? { append: p.suffix.trim() } : {})}
        />
      );
    }
  }
}
