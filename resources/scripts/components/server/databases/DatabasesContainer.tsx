import { httpErrorToHuman } from '@/api/http';
import getServerDatabases from '@/api/server/databases/getServerDatabases';
import FlashMessageRender from '@/components/FlashMessageRender';
import Can from '@/components/elements/Can';
import { MainPageHeader } from '@/components/elements/MainPageHeader';
import ServerContentBlock from '@/components/elements/ServerContentBlock';
import CreateDatabaseButton from '@/components/server/databases/CreateDatabaseButton';
import DatabaseRow from '@/components/server/databases/DatabaseRow';
import { useDeepMemoize } from '@/plugins/useDeepMemoize';
import useFlash from '@/plugins/useFlash';
import { ServerContext } from '@/state/server';
import { For } from 'million/react';
import { useEffect, useState } from 'react';

export default () => {
    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);
    const databaseLimit = ServerContext.useStoreState((state) => state.server.data!.featureLimits.databases);

    const { addError, clearFlashes } = useFlash();
    const [loading, setLoading] = useState(true);

    const databases = useDeepMemoize(ServerContext.useStoreState((state) => state.databases.data));
    const setDatabases = ServerContext.useStoreActions((state) => state.databases.setDatabases);

    useEffect(() => {
        setLoading(!databases.length);
        clearFlashes('databases');

        getServerDatabases(uuid)
            .then((databases) => setDatabases(databases))
            .catch((error) => {
                console.error(error);
                addError({ key: 'databases', message: httpErrorToHuman(error) });
            })
            .then(() => setLoading(false));
    }, []);

    return (
        <ServerContentBlock title={'Databases'}>
            <FlashMessageRender byKey={'databases'} />
            <MainPageHeader title={'Databases'}>
                <Can action={'database.create'}>
                    <div className={`flex items-center justify-end`}>
                        {databaseLimit > 0 && databases.length > 0 && (
                            <p className={`text-sm text-zinc-300 mb-4 sm:mr-6 sm:mb-0`}>
                                {databases.length} of {databaseLimit} databases
                            </p>
                        )}
                        {databaseLimit > 0 && databaseLimit !== databases.length && <CreateDatabaseButton />}
                    </div>
                </Can>
            </MainPageHeader>

            {!databases.length && loading ? null : (
                <>
                    {databases.length > 0 ? (
                        <For each={databases} memo>
                            {(database, index) => (
                                <DatabaseRow
                                    key={database.id}
                                    database={database}
                                    className={index > 0 ? 'mt-1' : undefined}
                                />
                            )}
                        </For>
                    ) : (
                        <p className={`text-center text-sm text-zinc-300`}>
                            {databaseLimit > 0
                                ? 'Your server does not have any databases.'
                                : 'Databases cannot be created for this server.'}
                        </p>
                    )}
                </>
            )}
        </ServerContentBlock>
    );
};
