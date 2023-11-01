import { Box, Heading, Text } from 'grommet';
import { Add, Copy } from 'grommet-icons';
import { PrimaryButton } from '../PrimaryButton';

export type ReportProps = {
    reportType: string;
    reportTitle: string;
    agentType: string;
    reportLink: string;
}


export const Reports = ({
    supabase,
    userAddress,
    reports,
}: {
    supabase: any;
    userAddress: `0x${string}` | undefined;
    reports: ReportProps[];
}) => {

    const downloadFile = async (link: string) => {

        const { data, error } = await supabase
            .storage
            .from('researcher-reports')
            .download(link)

        if (!data) return;
        
        const urlData = URL.createObjectURL(data)

        const linkToDownload = document.createElement('a')
        linkToDownload.href = urlData
        linkToDownload.download = "report.pdf"

        document.body.appendChild(linkToDownload)
        linkToDownload.dispatchEvent(
            new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            })
        )

        document.body.removeChild(linkToDownload)
    }

  return (
    <>
    <Box
          pad={{ vertical: 'large', horizontal: 'large' }}
          gap="medium"
          fill="horizontal"
    >
        <Box>
            <Box direction="row" align="center" gap="small">
                <Heading level="2" margin="none" weight="bold">Report</Heading>
                <Text color={{light: "#808080"}}>{"(" + reports.length + "/5)"}</Text>
            </Box>
            <Text><span>&#42;</span> Download your reports here</Text>
        </Box>
        <Box 
            direction="row-responsive"
            align="center"
            justify="between"
            gap="small"
        >
            {
                reports.map((report, index) => (
                    <Box 
                        key={index}
                        height="250px"
                        width="200px"
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
                            <PrimaryButton 
                                label="Download" 
                                size="small"
                                onClick={() => downloadFile(`${userAddress}/${report.agentType}/${report.reportLink}`)}  
                            />
                        </Box>
                    </Box> 
                ))
            }
            {
                Array(5 - reports.length).fill(0).map((_, i) => (
                    <Box 
                        key={i+reports.length}
                        height="250px"
                        round="small"
                        width="200px"
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
