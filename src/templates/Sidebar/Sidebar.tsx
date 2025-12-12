import {
    Box,
    Drawer,
    IconButton,
} from '@mui/material';
import { useState } from 'react';
import { Icon, Separator } from '@ui';
import { useCommonState, useDeviceMedia } from '@utils';

import './Sidebar.styles.scss'
import cn from 'classnames';
import { ChatList } from '@/templates';

export const Sidebar = () => {
    const { isDesktop } = useDeviceMedia();
    const { chats, selectedChatId } = useCommonState()
    const [open, setOpen] = useState(!selectedChatId);

    const toggleDrawer = () => setOpen((b) => !b);

    return (
        <>
            {/* mobile, tablet - Drawer */}
            {!isDesktop && (
                <Box sx={{ position: 'absolute' }}>
                    <IconButton onClick={toggleDrawer} className='sidebar__burger-btn'>
                        <Icon name="burger" />
                    </IconButton>
                    <Drawer anchor="left" open={open} onClose={toggleDrawer} className='sidebar__drawer'>
                        <ChatList chats={chats} />
                        <IconButton onClick={toggleDrawer} className="back-btn">
                            <Icon name="arrow-chevron-down" rotate={90} />
                        </IconButton>
                    </Drawer>
                </Box>
            )}

            {/* desktop - fixed */}
            {isDesktop && (
                <Box className='sidebar-desktop'>
                    <ChatList chats={chats} />
                </Box>
            )}
        </>
    );
};
