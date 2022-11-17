import { Anchor, Box, Button, Notification, Text } from "grommet";
import {
  StatusCriticalSmall,
  StatusGoodSmall,
  StatusWarningSmall,
} from "grommet-icons";

export const df_min_cores = 8;
export const df_min_memory = 63000; // 64GB recommended, but AWS instances report 63xxx MB available

export const Identifier = ({ title, subtitle, content, icon }) => {
  return (
    <Box
      direction="row"
      gap="small"
      align="center"
      pad={{ horizontal: "small", vertical: "medium" }}
    >
      <Box pad={{ vertical: "xsmall" }}>{icon}</Box>
      <Box>
        <Text color="text-strong" size="large" weight="bold">
          {title}
        </Text>
        <Text>{subtitle}</Text>
      </Box>
      {content}
    </Box>
  );
};

export const goodIcon = <StatusGoodSmall color="status-ok" size="small" />;
export const warnIcon = (
  <StatusWarningSmall color="status-warning" size="small" />
);
export const badIcon = (
  <StatusCriticalSmall color="status-critical" size="small" />
);

export const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).then(
    () => {
      return true;
    },
    () => {
      return false;
    }
  );
};

// Read single file from user
export const readSingleFile = (files, callback) => {
  if (files.length === 1) {
    const reader = new FileReader();
    reader.onload = async (e) => {
      callback(e.target.result);
    };
    reader.readAsText(files[0]);
  }
};

export const errorBar = (error, setError) => {
  return error.length > 0 ? (
    <Notification
      status="critical"
      onClose={() => {
        setError([]);
      }}
      message={error.join("\n")}
      toast
    />
  ) : (
    <></>
  );
};

export const getMatchBetweenRegex = (text, start, end) => {
  return (RegExp(
    "(?<=" + start + ")" + /[\s\S]*?/.source + "(?=" + end + ")"
  ).exec(text) || [null])[0];
};

export const getMatchBetweenPattern = (text, pattern) => {
  let start = `${pattern}==`;
  let end = `==END_${pattern}`;
  return (RegExp(
    "(?<=" + start + ")" + /[\s\S]*?/.source + "(?=" + end + ")"
  ).exec(text) || [null])[0];
};

// resource mapping from dfcaninstall.yml
export const mapResources = (data) => {
  let resources = data.map((s) => {
    return { name: s.split(" ")[0], state: s.split(" ")[1] };
  });

  const min_memory_mb = df_min_memory;
  const min_swap_mb = Math.ceil(
    resources.find((r) => r.name === "memory").state * 0.2
  );
  const has_enough_memory =
    resources.find((r) => r.name === "memory").state > min_memory_mb;
  const has_enough_swap =
    resources.find((r) => r.name === "swap").state > min_swap_mb;
  const has_available_disks =
    resources.find((r) => r.name === "disks").state !== "";
  const has_enough_cores =
    resources.find((r) => r.name === "cores").state >= df_min_cores;

  let res = resources.map((r) => {
    switch (r.name) {
      case "cores":
        r.valid = has_enough_cores;
        break;
      case "memory":
        r.valid = has_enough_memory;
        break;
      case "swap":
        r.valid = has_enough_swap;
        break;
      case "disks":
        r.valid = has_available_disks;
        break;

      default:
        break;
    }
    return r;
  });
  return res;
};

export const runAnsible = (playbook, vars) => {
  if (playbook && vars) {
    window.ezdemoAPI.ansiblePlay([playbook, vars]);
    return true;
  } else return false;
};

export const BrowserLink = ({
  url,
  label,
  disabled = false,
  icon = undefined,
}) => {
  return icon ? (
    <Button
      icon={icon}
      label={label}
      onClick={() => window.ezdemoAPI.openInBrowser(url)}
    />
  ) : (
    <Anchor
      label={label}
      target="_blank"
      rel="noopener"
      onClick={() => window.ezdemoAPI.openInBrowser(url)}
    />
  );
};

// updates for state objects, modify object property for a list of objects
export const addOrUpdate = (list, param, compareTo, newItem) => {
  if (list)
    if (list.some((i) => i[param] === compareTo))
      return list.map((i) => (i[param] === compareTo ? newItem : i));
    else list.push(newItem);
  else list = [newItem];
  return list;
};
