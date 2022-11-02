import { NameValueList, NameValuePair, Page, Text } from "grommet";

export const VmCard = ({ vm }) => {
  return (
    <Page>
      <NameValueList nameProps={{ width: "xsmall" }}>
        <NameValuePair name="OS">{vm.guest_OS}</NameValuePair>
        <NameValuePair name="Cores">{vm.cpu.count}</NameValuePair>
        <NameValuePair name="Memory">
          {`${vm.memory.size_MiB / 1024} GiB`}
        </NameValuePair>
        <NameValuePair name="Disks">
          {vm.disks.map((d, i) => (
            <Text key={i}>
              {d.value.label}: {d.value.capacity / 1024 / 1024 / 1024}GiB
            </Text>
          ))}
        </NameValuePair>
        <NameValuePair name="NICs">
          {vm.nics.map((n, i) => (
            <Text key={i}>
              {n.value.label}: {n.value.state}
            </Text>
          ))}
        </NameValuePair>
      </NameValueList>
    </Page>
  );
};
