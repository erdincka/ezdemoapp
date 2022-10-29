import {
  Anchor,
  Button,
  NameValueList,
  NameValuePair,
  Page,
  PageHeader,
} from "grommet";
import { Ezmeral, NewWindow } from "grommet-icons";
import { useNavigate, useParams } from "react-router-dom";
import { ReverseAnchor } from "./ReverseAnchor";

export const DataFabricCard = () => {
  const { address } = useParams();
  const navigate = useNavigate();

  const services = [
    { name: "MCS", url: `https://${address}:8443/` },
    {
      name: "S3 Object Store",
      url: `https://${address}:8443/app/mcs/opal/#/home`,
    },
    { name: "Drill", url: `https://${address}:8047/` },
    { name: "Grafana", url: `https://${address}:3000/` },
    { name: "Hue", url: `https://${address}:8888/` },
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
            onClick={() => console.dir("lets play")}
          />
        }
        pad={{ vertical: "medium" }}
      />

      <NameValueList>
        {services.map((service) => (
          <NameValuePair name={service.name} key={service.name}>
            <Anchor
              label={service.url}
              href={service.url}
              target="_blank"
              rel="noopener"
              icon={<NewWindow />}
            />
          </NameValuePair>
        ))}
      </NameValueList>
    </Page>
  );
};
