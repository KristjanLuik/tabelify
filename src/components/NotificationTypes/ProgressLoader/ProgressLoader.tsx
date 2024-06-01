import {CustomContentProps, SnackbarContent} from "notistack";
import {forwardRef} from "react";
import Card from "@mui/material/Card";
import LinearProgress from "@mui/material/LinearProgress";
import {Box} from "@mui/material";
import Typography from "@mui/material/Typography";


interface ProgressLoaderProps extends CustomContentProps {
    progress: number;
}

import './ProgressLoader.css';

const ProgressLoader = forwardRef<HTMLDivElement, ProgressLoaderProps>(
    ({ id, ...props }, ref) => {

        return (
            <SnackbarContent ref={ref} className="ProgressLoader" key={id}>
                <Card className="card" style={{ backgroundColor: "#fddc6c" }}>
                    <Box className="wrapper" >
                        <Box className="loader" >
                            <LinearProgress variant={"determinate"} value={props.progress} />
                        </Box>
                        <Box sx={{ minWidth: 35 }}>
                            <Typography variant="body2" color="text.secondary">{`${Math.round(
                                props.progress,
                            )}%`}</Typography>
                        </Box>
                    </Box>
                </Card>
             </SnackbarContent>
        );
    });

export default ProgressLoader;