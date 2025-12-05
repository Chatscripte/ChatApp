import { Box, Skeleton, Stack, List, ListItem, ListItemText, ListItemAvatar, Avatar } from "@mui/material";

export default function UserSearchSkeleton({ results = 5 }) {
  // Simple skeleton list to show while user search results are loading
  return (
    <Box sx={{ width: "100%", maxWidth: 640, mx: "auto", p: 2 }}>
        <List>
          {Array.from({ length: results }).map((_, i) => (
            <ListItem key={i} alignItems="flex-start">
              <ListItemAvatar>
                {/* circular avatar skeleton */}
                <Skeleton variant="circular">
                  <Avatar />
                </Skeleton>
              </ListItemAvatar>

              <ListItemText
                primary={
                  // primary text skeleton (e.g. user name)
                  <Skeleton width="40%" />
                }
                secondary={
                  // secondary text skeleton (e.g. handle or email)
                  <Stack spacing={0.5}>
                    <Skeleton width="60%" />
                    <Skeleton width="30%" />
                  </Stack>
                }
              />
            </ListItem>
          ))}
        </List>
    </Box>
  );
}
