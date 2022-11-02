import {
  Anchor,
  Button,
  NameValueList,
  NameValuePair,
  Page,
  PageHeader,
  Text,
} from "grommet";
import { Ezmeral } from "grommet-icons";
import { useNavigate, useParams } from "react-router-dom";
import { ReverseAnchor } from "./ReverseAnchor";
import { copyToClipboard } from "./Utils";

export const DataFabricCard = () => {
  const { address } = useParams();
  const navigate = useNavigate();

  const services = [
    { name: "Installer", url: `https://${address}:9443/` },
    { name: "MCS", url: `https://${address}:8443/` },
    {
      name: "S3 Object Store",
      url: `https://${address}:8443/app/mcs/opal/#/home`,
    },
    { name: "Airflow", url: `https://${address}:8780/` },
    { name: "NiFi (*)", url: `https://${address}:12443/nifi/` },
    { name: "Drill", url: `https://${address}:8047/` },
    { name: "Hue", url: `https://${address}:8888/` },
    { name: "Zeppelin", url: `https://${address}:9995/` },
    { name: "Ranger", url: `https://${address}:6182/` },
    // { name: "Livy Rest", url: `https://${address}:8998/` },
    { name: "Grafana", url: `https://${address}:3000/` },
    { name: "Kibana", url: `https://${address}:5601/` },
  ];

  return (
    <Page pad={{ horizontal: "medium" }}>
      <PageHeader
        title={address}
        parent={<ReverseAnchor label="Back" onClick={() => navigate(-1)} />}
        actions={
          <Button
            icon={<Ezmeral color="plain" />}
            onClick={() => copyToClipboard(address)}
          />
        }
        pad={{ vertical: "medium" }}
      />

      <NameValueList>
        {services.map((service) => (
          <NameValuePair name={service.name} key={service.name}>
            <Anchor
              target="_blank"
              rel="noopener"
              label={service.url}
              onClick={() => {
                window.ezdemoAPI.openInBrowser(service.url);
              }}
              // icon={<NewWindow />}
            />
            {/* <Anchor
              label={service.url}
              href={service.url}
              target="_blank"
              rel="noopener"
            /> */}
          </NameValuePair>
        ))}
      </NameValueList>
      <Text color="text-weak">(*) NiFi username: mapr</Text>
      <Text color="text-weak">
        NiFi password: "mapruserwithmapr", replace trailing "mapr" with your
        admin password.
      </Text>
    </Page>
  );
};
