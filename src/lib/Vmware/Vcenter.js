import { Anchor, Box, Button, Heading, List, Text } from "grommet";
import { Refresh, VirtualMachine } from "grommet-icons";
import { useEffect, useState } from "react";
import { Popup } from "../Popup";
import { VmCard } from "./VmCard";
import { filteredVms, listVms } from "./vmClient";

export const Vcenter = ({ client, setServers }) => {
  const [vms, setVms] = useState();
  const [selected, setSelected] = useState();
  const [popup, setPopup] = useState();

  // Load VMs with filter
  useEffect(() => {
    listVms(client.address, client.session)
      .then((data) => setVms(filteredVms(data)))
      .catch((error) => console.error(error));
  }, [client]);

  const handleSelect = (id) => {
    let vars = {
      address: client.address,
      request: "vm/" + id,
      session: client.session,
    };
    window.ezdemoAPI
      .queryVcenter(vars)
      .then((data) => {
        setSelected(data);
        setPopup("selected");
      })
      .catch((error) => console.error(error));
  };
  const vmSelect = (id) => {
    let vars = {
      address: client.address,
      request: "vm/" + id + "/guest/identity",
      session: client.session,
    };
    window.ezdemoAPI
      .queryVcenter(vars)
      .then((data) => {
        // console.dir(data);
        const connection = {
          address: data.ip_address,
          displayName: data.host_name,
        };
        setServers((prev) => {
          return [...prev, connection];
        });
      })
      .catch((error) => console.error(error));
  };

  return (
    <Box margin="small" gap="small">
      <Heading level={5}>Virtual Machines on {client.address}</Heading>
      {client && (
        <Box direction="row">
          <Button
            alignSelf="start"
            icon={<Refresh />}
            onClick={async () => {
              setVms(
                filteredVms(await listVms(client.address, client.session))
              );
            }}
          />
        </Box>
      )}
      <List
        data={vms || []}
        paginate
        step={5}
        border="horizontal"
        action={(vm, index) => (
          <Box key={index} direction="row" align="center" gap="medium">
            <Button label="Select" onClick={() => vmSelect(vm.vm)} />
          </Box>
        )}
      >
        {(vm, index) => (
          <Box
            key={index}
            gap="medium"
            direction="row"
            align="center"
            justify="between"
          >
            <Box width="medium">
              <Anchor onClick={() => handleSelect(vm.vm)}>{vm.name}</Anchor>
            </Box>
            <Box align="end">
              <Text color="text-weak">{vm.cpu_count} cores</Text>
              <Text color="text-weak">{vm.memory_size_MiB / 1024}GB mem</Text>
            </Box>
          </Box>
        )}
      </List>
      {popup === "selected" && (
        <Popup
          title="VM Details"
          subtitle={selected?.name}
          icon={<VirtualMachine />}
          closer={setPopup}
          content={
            <VmCard
              vm={selected}
              onConnect={(c) => {
                setPopup(false);
              }}
            />
          }
        />
      )}
    </Box>
  );
};
