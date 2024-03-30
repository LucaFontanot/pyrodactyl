import { Schedule } from '@/api/server/schedules/getServerSchedules';
import { Button } from '@/components/elements/button/index';
import TaskDetailsModal from '@/components/server/schedules/TaskDetailsModal';
import { useState } from 'react';

interface Props {
    schedule: Schedule;
}

export default ({ schedule }: Props) => {
    const [visible, setVisible] = useState(false);

    return (
        <>
            <TaskDetailsModal schedule={schedule} visible={visible} onModalDismissed={() => setVisible(false)} />
            <Button onClick={() => setVisible(true)} className={'flex-1'}>
                New Task
            </Button>
        </>
    );
};
