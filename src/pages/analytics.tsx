import {
  Box,
  DataTable,
  Form,
  FormField,
  Heading,
  Spinner,
  Text,
  TextInput,
} from 'grommet';
import { Layout, PrimaryButton } from '../components';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

export default function AnalyticsPage() {
  const [holders, setHolders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadHolders = async () => {
    setLoading(true);
    const holdersRequest = await fetch(
      `/api/holders?tokenAddress=${process.env.NEXT_PUBLIC_FLOCK_TOKEN_ADDRESS}`
    );

    const { holders } = await holdersRequest.json();
    console.log(holders);
    setHolders(holders);
    setLoading(false);
  };
  useEffect(() => {
    loadHolders();
  }, []);

  return (
    <Layout>
      <Box width="100%" gap="large">
        <Box
          background="#EEEEEE"
          direction="row"
          align="center"
          justify="center"
          width="100%"
          pad={{ vertical: 'large' }}
        >
          <Box>
            <Box direction="row" gap="xsmall">
              <Heading level="2">FLock Analytics</Heading>
            </Box>
          </Box>
        </Box>
        <Box width="100%" align="center" pad="large">
          {loading ? (
            <Spinner size="medium" />
          ) : (
            <DataTable
              sortable
              columns={[
                {
                  property: 'address',
                  header: 'Address',
                  primary: true,
                },
                {
                  property: 'interactions',
                  header: 'Participations',
                },
                {
                  property: 'balance',
                  header: 'Balance',
                  render: (datum) => (
                    <Text>{ethers.utils.formatEther(datum.balance)}</Text>
                  ),
                },
              ]}
              data={holders}
            />
          )}
        </Box>
      </Box>
    </Layout>
  );
}
