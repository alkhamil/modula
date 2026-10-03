/** Render satu field definisi menjadi FormItem — dipakai form runtime + kartu kanvas. */
import type { ReactNode } from 'react';
import { FormGroup, FormItem } from '../../../shared/components/ui';
import type { Column } from '../../../shared/components/ui/Table';
import {
  CheckboxField,
  CheckboxGroupField,
  ColorField,
  DatePickerField,
  DateRangeField,
  EditorField,
  FileUploadField,
  FormArrayField,
  PasswordField,
  RadioGroupField,
  SelectField,
  SelectMultipleField,
  SwitchField,
  TextAreaField,
  TextField,
} from '../../../shared/components/ui/fields';
import type { GeneratorFieldConfig } from '../types';
import { parseConfigDate } from '../componentProps';
import type { DynamicOption } from './types';
import { columnRenderForType } from './cellRender';
import { fieldRulesToRHF, maxLengthOf, rowFormValues, rowPayloadValues } from './validation';
import type { LoadOptionsFn } from '../../../shared/components/ui/fields/SelectField';

export interface FieldRenderContext {
  testPrefix: string;
  optionsOf: (field: GeneratorFieldConfig) => DynamicOption[];
  loaderOf: (field: GeneratorFieldConfig) => LoadOptionsFn | undefined;
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
    layout: itemProps?.layout ?? ('horizontal' as const),
    ...(itemProps?.labelWidth?.trim() ? { labelWidth: itemProps.labelWidth.trim() } : {}),
    ...(itemProps?.align ? { align: itemProps.align } : {}),
    ...(itemProps?.labelTooltip?.trim() ? { labelTooltip: itemProps.labelTooltip.trim() } : {}),
    ...(itemProps?.labelFontWeight ? { labelFontWeight: itemProps.labelFontWeight } : {}),
    ...(field.disabled === true ? { disabled: true as const } : {}),
  };
  const lower = field.label.toLowerCase();
  const placeholderFor = (verb: string): string =>
    field.placeholder?.trim() || `${verb} ${lower}`;
  const props = field.componentProps;
  switch (field.type) {
    case 'numberField': {
      const p = props?.text;
      return (
        <FormItem
          label={field.label}
          {...common}
          component={TextField}
          currency
          placeholder={placeholderFor('Enter')}
          {...(p?.size ? { size: p.size } : {})}
          {...(p?.clearable !== undefined ? { clearable: p.clearable } : {})}
          {...(p?.prefix?.trim() ? { prepend: p.prefix.trim() } : {})}
          {...(p?.suffix?.trim() ? { append: p.suffix.trim() } : {})}
        />
      );
    }
    case 'currencyField': {
      // Selalu format currency; simbol via prefix (default Rp).
      const p = props?.text;
      return (
        <FormItem
          label={field.label}
          {...common}
          component={TextField}
          currency
          placeholder={placeholderFor('Enter')}
          prepend={p?.prefix?.trim() || 'Rp'}
          {...(p?.size ? { size: p.size } : {})}
          {...(p?.clearable !== undefined ? { clearable: p.clearable } : {})}
          {...(p?.suffix?.trim() ? { append: p.suffix.trim() } : {})}
        />
      );
    }
    case 'textareaField': {
      const p = props?.textarea;
      return (
        <FormItem
          label={field.label}
          {...common}
          component={TextAreaField}
          placeholder={placeholderFor('Enter')}
          {...(p?.size ? { size: p.size } : {})}
          {...(field.rows && field.rows > 0 ? { rows: field.rows } : {})}
        />
      );
    }
    case 'passwordField': {
      const maxLength = maxLengthOf(field);
      const p = props?.password;
      return (
        <FormItem
          label={field.label}
          {...common}
          component={PasswordField}
          {...(maxLength !== null ? { maxLength } : {})}
          placeholder={placeholderFor('Enter')}
          {...(p?.size ? { size: p.size } : {})}
          {...(p?.defaultVisible !== undefined ? { defaultVisible: p.defaultVisible } : {})}
        />
      );
    }
    case 'dateField': {
      const p = props?.date;
      const minDate = parseConfigDate(p?.minDate);
      const maxDate = parseConfigDate(p?.maxDate);
      return (
        <FormItem
          label={field.label}
          {...common}
          component={DatePickerField}
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
          label={field.label}
          {...common}
          component={DateRangeField}
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
            label={field.label}
            {...common}
            component={SelectField}
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
          label={field.label}
          {...common}
          component={SelectField}
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
            label={field.label}
            {...common}
            component={SelectMultipleField}
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
          label={field.label}
          {...common}
          component={SelectMultipleField}
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
          label={field.label}
          {...common}
          component={RadioGroupField}
          options={ctx.optionsOf(field)}
          {...(p?.size ? { size: p.size } : {})}
        />
      );
    }
    case 'checkboxField': {
      const p = props?.checkbox;
      return (
        <FormItem
          label={field.label}
          {...common}
          component={CheckboxField}
          {...(p?.size ? { size: p.size } : {})}
          {...(p?.indeterminate !== undefined ? { indeterminate: p.indeterminate } : {})}
        />
      );
    }
    case 'checkboxGroupField': {
      const p = props?.checkboxGroup;
      return (
        <FormItem
          label={field.label}
          {...common}
          component={CheckboxGroupField}
          options={ctx.optionsOf(field)}
          {...(p?.size ? { size: p.size } : {})}
        />
      );
    }
    case 'switchField': {
      const p = props?.switch;
      return (
        <FormItem
          label={field.label}
          {...common}
          component={SwitchField}
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
          label={field.label}
          {...common}
          component={FileUploadField}
          {...(p?.size ? { size: p.size } : {})}
          {...(p?.multiple !== undefined ? { multiple: p.multiple } : {})}
          {...(field.accept?.trim() ? { accept: field.accept.trim() } : {})}
        />
      );
    }
    case 'colorField': {
      const p = props?.color;
      return (
        <FormItem
          label={field.label}
          {...common}
          component={ColorField}
          {...(p?.size ? { size: p.size } : {})}
        />
      );
    }
    case 'editorField': {
      const p = props?.editor;
      return (
        <FormItem
          label={field.label}
          {...common}
          component={EditorField}
          {...(p?.size ? { size: p.size } : {})}
        />
      );
    }
    case 'formArrayField': {
      const p = props?.array;
      const subs = field.subFields ?? [];
      const columns: Column<Record<string, unknown>>[] = subs.map((sub) => {
        const column: Column<Record<string, unknown>> = { key: sub.name, header: sub.label };
        const render = columnRenderForType(sub.type, sub.name);
        if (render) column.render = render;
        return column;
      });
      return (
        <FormItem
          label={field.label}
          {...common}
          component={FormArrayField}
          columns={columns}
          renderEditor={({ initial, onSave, formId }) => (
            <FormGroup<Record<string, unknown>>
              testId={`${testId}-row-form`}
              id={formId}
              defaultValues={rowFormValues(subs, initial)}
              onSubmit={(formRow) => onSave(rowPayloadValues(subs, formRow))}
            >
              <div className="flex flex-col section-gap">
                {subs.map((sub) =>
                  renderDynamicField(sub, {
                    testPrefix: `${testId}-row`,
                    optionsOf: ctx.optionsOf,
                    loaderOf: ctx.loaderOf,
                  }),
                )}
              </div>
            </FormGroup>
          )}
          {...(p?.size ? { size: p.size } : {})}
          {...(p?.addLabel?.trim() ? { addLabel: p.addLabel.trim() } : {})}
          editorTitle={p?.editorTitle?.trim() || field.label}
          {...(p?.emptyTitle?.trim() ? { emptyTitle: p.emptyTitle.trim() } : {})}
          {...(p?.emptyDescription?.trim() ? { emptyDescription: p.emptyDescription.trim() } : {})}
          {...(p?.maxRows ? { maxRows: p.maxRows } : {})}
          {...(p?.lockFirstRow !== undefined ? { lockFirstRow: p.lockFirstRow } : {})}
        />
      );
    }
    case 'textField':
    default: {
      const maxLength = maxLengthOf(field);
      const p = props?.text;
      return (
        <FormItem
          label={field.label}
          {...common}
          component={TextField}
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
