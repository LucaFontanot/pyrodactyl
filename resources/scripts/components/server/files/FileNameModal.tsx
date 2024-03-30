import Field from '@/components/elements/Field';
import Modal, { RequiredModalProps } from '@/components/elements/Modal';
import { Button } from '@/components/elements/button/index';
import { ServerContext } from '@/state/server';
import { Form, Formik, FormikHelpers } from 'formik';
import { join } from 'pathe';
import { object, string } from 'yup';

type Props = RequiredModalProps & {
    onFileNamed: (name: string) => void;
};

interface Values {
    fileName: string;
}

export default ({ onFileNamed, onDismissed, ...props }: Props) => {
    const directory = ServerContext.useStoreState((state) => state.files.directory);

    const submit = (values: Values, { setSubmitting }: FormikHelpers<Values>) => {
        onFileNamed(join(directory, values.fileName));
        setSubmitting(false);
    };

    return (
        <Formik
            onSubmit={submit}
            initialValues={{ fileName: '' }}
            validationSchema={object().shape({
                fileName: string().required().min(1),
            })}
        >
            {({ resetForm }) => (
                <Modal
                    onDismissed={() => {
                        resetForm();
                        onDismissed();
                    }}
                    {...props}
                >
                    <Form className='m-0 w-full flex flex-col gap-4'>
                        <Field
                            id={'fileName'}
                            name={'fileName'}
                            label={'File Name'}
                            description={'Enter the name that this file should be saved as.'}
                            autoFocus
                        />
                        <div className={`flex justify-end w-full my-4`}>
                            <Button>Create File</Button>
                        </div>
                    </Form>
                </Modal>
            )}
        </Formik>
    );
};
