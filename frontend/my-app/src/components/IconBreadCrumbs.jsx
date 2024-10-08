import * as React from "react";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import HomeIcon from "@mui/icons-material/Home";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";

function IconBreadCrumbs({ id, codeBlock }) {
  return (
    <div>
      <Breadcrumbs aria-label="breadcrumb">
        <Link
          underline="hover"
          sx={{ display: "flex", alignItems: "center" }}
          color="inherit"
          href="/"
          title="Home"
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Home
        </Link>
        {id && ( //Check if id exists. In other words, if inside a code block page
          <Link
            underline="none"
            sx={{ display: "flex", alignItems: "center" }}
            color="inherit"
          >
            <AssignmentRoundedIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            <Typography sx={{ cursor: "default" }}>
              {codeBlock?.title}
            </Typography>
          </Link>
        )}
      </Breadcrumbs>
    </div>
  );
}

export default IconBreadCrumbs;
