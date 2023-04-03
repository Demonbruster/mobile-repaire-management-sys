import { notifications } from "@mantine/notifications";
import { IconCircleCheck, IconPoo, IconAlertTriangle, IconInfoCircle } from '@tabler/icons-react'

interface INotification {
	title?: string;
	message: string;
	type: "success" | "error" | "warning" | "info";
}

export default function showNotification({ message, title, type }: INotification) {
	switch (type) {
		case "success":
			notifications.show({
				title: title || "Success",
				message,
				styles: (theme) => ({
          root: {
            color: theme.colors.green[7],
            borderColor: theme.colors.green[7],
            "&:hover": {
              backgroundColor: theme.colors.green[0],
            },
          },
          icon: {
            color: theme.colors.green[7],
            backgroundColor: theme.colors.green[0],
          },
        }),
				icon: <IconCircleCheck/>,
			});
			break;
		case "error":
			notifications.show({
				title: title || "Error",
				message,
        styles: (theme) => ({
          root: {
            color: theme.colors.red[7],
            borderColor: theme.colors.red[7],
            "&:hover": {
              backgroundColor: theme.colors.red[0],
            },
          },
          icon: {
            color: theme.colors.red[7],
            backgroundColor: theme.colors.red[0],
          },
        }),

				icon: <IconPoo/>
			});
			break;
		case "warning":
			notifications.show({
				title: title || "Warning",
				message,
				styles: (theme) => ({
          root: {
            color: theme.colors.yellow[7],
            borderColor: theme.colors.yellow[7],
            "&:hover": {
              backgroundColor: theme.colors.yellow[0],
            },
          },
          icon: {
            color: theme.colors.yellow[7],
            backgroundColor: theme.colors.yellow[0],
          },
        }),
				icon: <IconAlertTriangle/>,
			});
			break;
		default:
			notifications.show({
				title: title || "Info",
				message,
				styles: (theme) => ({
          root: {
            color: theme.colors.blue[7],
            borderColor: theme.colors.blue[7],
            "&:hover": {
              backgroundColor: theme.colors.blue[0],
            },
          },
          icon: {
            color: theme.colors.blue[7],
            backgroundColor: theme.colors.blue[0],
          },
        }),
				icon: <IconInfoCircle/>,
			});
			break;
	}
}
