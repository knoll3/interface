import { Box, Heading, Text } from 'grommet';
import { Add, Copy } from 'grommet-icons';
import { PrimaryButton } from '../PrimaryButton';

type ReportProps = {
    reportType: string;
    reportTitle: string;
    reportLink: string;
}

export const Reports = ({
  reports,
}: {
  reports: ReportProps[];
}) => {

    const downloadLink = async (link: string) => {};

  return (
    <>
    <Box
          pad={{ vertical: 'large', horizontal: 'large' }}
          gap="medium"
    >
        <Box>
            <Box direction="row" align="center" gap="small">
                <Heading level="2" margin="none" weight="bold">Report</Heading>
                <Text color={{light: "#808080"}}>{"(" + reports.length + "/5)"}</Text>
            </Box>
            <Text><span>&#42;</span> Download your reports here</Text>
        </Box>
        <Box direction="row" gap="medium">
            {
                reports.map((report, index) => (
                    <Box 
                        key={index}
                        height="250px"
                        width="small"
                        round="small"
                        justify="between"
                        border={{ style:"solid", size: "small" }} 
                        pad="small"   
                    >
                        <Box direction="row" justify="between" align="center">
                            <Copy />
                            <Box background="brand" pad="xsmall" round="medium">
                                <Text size="small" color="white" weight="bold">{report.reportType}</Text>
                            </Box>
                        </Box>
                        <Box>
                            <Text weight="bold">{report.reportTitle}</Text>
                        </Box>
                        <Box justify="end" align="end">
                            <PrimaryButton label="Download" size="small" onClick={() => downloadLink(report.reportLink)} />
                        </Box>
                    </Box> 
                ))
            }
            {
                Array(5 - reports.length).fill(0).map((_, i) => (
                    <Box 
                        key={i+reports.length}
                        height="250px"
                        width="small"
                        round="small"
                        border={{ style:"dashed", size: "small" }}
                        justify="center"    
                    >
                        <Box align="center" gap="small">
                            <Add color={"#808080"} size="large" />
                            <Text color={{light: "#808080"}}>({reports.length+i+1}/5)</Text>
                        </Box>
                    </Box>                
                ))
            }
        </Box>
    </Box>
  </>
  );
};
