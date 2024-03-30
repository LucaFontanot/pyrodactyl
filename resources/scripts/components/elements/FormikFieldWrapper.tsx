import InputError from '@/components/elements/InputError';
import Label from '@/components/elements/Label';
import { Field, FieldProps } from 'formik';

interface Props {
    id?: string;
    name: string;
    children: React.ReactNode;
    className?: string;
    label?: string;
    description?: string;
    validate?: (value: any) => undefined | string | Promise<any>;
}

const FormikFieldWrapper = ({ id, name, label, className, description, validate, children }: Props) => (
    <Field name={name} validate={validate}>
        {({ field, form: { errors, touched } }: FieldProps) => (
            <div className={`${className} ${touched[field.name] && errors[field.name] ? 'has-error' : undefined}`}>
                {label && (
                    <Label className='text-sm text-[#ffffff77]' htmlFor={id}>
                        {label}
                    </Label>
                )}
                {children}
                <InputError errors={errors} touched={touched} name={field.name}>
                    {description || null}
                </InputError>
            </div>
        )}
    </Field>
);

export default FormikFieldWrapper;
