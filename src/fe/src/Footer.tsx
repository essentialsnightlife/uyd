import * as React from 'react';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

export default function Footer() {
    return (
        <Typography variant="body2" color="text.secondary" >
            {'Copyright © '}
            <Link color="inherit" >
                Peng Devs
            </Link>{' '}
            {new Date().getFullYear()}.
            {' '}<Link color="inherit" >
                Leave Feedback
            </Link>
        </Typography>
    );
}
