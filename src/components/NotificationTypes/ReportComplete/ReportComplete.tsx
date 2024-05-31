import { useState, forwardRef, useCallback } from "react";
import clsx from "clsx";
import { useSnackbar, SnackbarContent, CustomContentProps } from "notistack";
import Collapse from "@mui/material/Collapse";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";


import './ReportComplete.css';

interface ReportCompleteProps extends CustomContentProps {
    allowDownload?: boolean;
}

const ReportComplete = forwardRef<HTMLDivElement, ReportCompleteProps>(
    ({ id, ...props }, ref) => {
        const { closeSnackbar } = useSnackbar();
        const [expanded, setExpanded] = useState(false);

        const handleExpandClick = useCallback(() => {
            setExpanded((oldExpanded) => !oldExpanded);
        }, []);

        const handleDismiss = useCallback(() => {
            closeSnackbar(id);
        }, [id, closeSnackbar]);

        return (
            <SnackbarContent ref={ref} className="SnackbarContent">
                <Card className="card" style={{ backgroundColor: "#fddc6c" }}>
                    <CardActions className="actionRoot">
                        <Typography variant="body2" className="typography">
                            {props.message}
                        </Typography>
                        <div className="icons">
                            <IconButton
                                aria-label="Show more"
                                size="small"
                                className={clsx({ expanded: true, expandOpen: expanded})}
                                onClick={handleExpandClick}
                            >
                                <ExpandMoreIcon />
                            </IconButton>
                            <IconButton
                                size="small"
                                className="expand"
                                onClick={handleDismiss}
                            >
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </div>
                    </CardActions>
                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                        <Paper className="paper">
                            <Typography
                                gutterBottom
                                variant="caption"
                                style={{ color: "#000", display: "block" }}
                            >
                                PDF ready
                            </Typography>
                            <Button size="small" color="primary" className="button">
                                <CheckCircleIcon className="checkIcon" />
                                Download now
                            </Button>
                        </Paper>
                    </Collapse>
                </Card>
            </SnackbarContent>
        );
    }
);

ReportComplete.displayName = "ReportComplete";

export default ReportComplete;
