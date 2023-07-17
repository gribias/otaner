import { IResourceComponentsProps } from "@refinedev/core";
import { MuiShowInferencer } from "@refinedev/inferencer/mui";
import { Typography, Box, Stack } from "@mui/material";
import{useDelete, useGetIdentity, useShow} from "@refinedev/core";
import { useParsed , useNavigation } from "@refinedev/core";
import{Delete, Edit} from "@mui/icons-material";
import {CustomButton} from "../../components/common/customButton";
import {CustomButtonEddit} from "../../components/common/customButtonEddit";

import {PropertyCardProps} from '../../interfaces/property';
export const ProductShow: React.FC<IResourceComponentsProps> = () => {
//  return <MuiShowInferencer />;
const { list , edit} = useNavigation();
const { data: user } = useGetIdentity() as { data: { email: string } };
const {id} = useParsed();
const { mutate } = useDelete();

const { queryResult } = useShow();

const {data, isLoading, isError} = queryResult;

const productDetails = data?.data ?? [];

if(isLoading) return <div>Loading...</div>
if(isError) return <div>Error</div>

const isCurrentUser = user.email === productDetails.creator.email || user.email === "gabrielcorreia94@gmail.com";

  function handleDeleteProperty() {
    // eslint-disable-next-line no-restricted-globals
    const response = confirm('Eliminar producto? (Esta ação é irreversível)');
    if(response) {
     mutate({
      resource: 'products',
      id: id as string,
     },{
        onSuccess: () => {
          list('products');
        },
     })
    }
  }

  // function handleEditProperty() {
  //   edit('products', id as string);
  // }

return (
  
    <Box
      borderRadius="15px"
      padding="20px"
      bgcolor="#fcfcfc"
      width="fit-content"
    >
      <Typography fontSize={25} fontWeight={700} color="#11142d">
        {" "}
        Propriedades{" "}
      </Typography>
      <Box
        mt="20px"
        display="flex"
        flexDirection={{
          xs: "column",
          lg: "row",
        }}
        gap={4}
      >
        <Box flex={1} maxWidth={764}>
          <img
            src={productDetails.photo}
            alt={productDetails.reference}
            height={546}
            style={{ objectFit: "cover", borderRadius: "10px" }}
            className="property_details-img"
          />

          <Box mt="15px">
          <Stack>
  {Object.entries(productDetails.material).map(([type, value]) => (
    <Stack key={type} direction="row" alignItems="center" gap={2}>
      <Typography
        fontSize={18}
        fontWeight={500}
        color="#11142d"
        textTransform="capitalize"
      >
        {type}
      </Typography>
      <Typography
        fontSize={14}
        fontWeight={500}
        color="#808191"
        textTransform="capitalize"
      >
        Gramas: {(value as { grams: number }).grams}
      </Typography>
    </Stack>
  ))}
</Stack>


            <Stack direction="row" justifyContent="space-between"
            flexWrap="wrap" alignItems="center" mt="10px"
            >
              <Box >
                <Typography
                  fontSize={22}
                  fontWeight={600}
                  color="#11142d"
                  textTransform="capitalize"
                >
                  {productDetails.reference}
                </Typography>
                </Box>
                <Box>
                <Typography fontSize={16} fontWeight={600} mt="10px" color="#11142D">Preço</Typography>
                <Stack direction="row" alignItems="flex-end" gap={1}>
                  <Typography fontSize={25} fontWeight={700} color="#475BE8">€{productDetails.cost}</Typography>
                  {/* <Typography fontSize={14} color="#808191" mb={0.5}>for one day</Typography> */}
                </Stack>
              </Box>
              </Stack>
              <Stack>

              
              <Box>
             
              <Typography
                fontSize={18}
                fontWeight={500}
                color="#11142d"
                textTransform="capitalize"
              >
                Descrição: {productDetails.description}
              </Typography>
              </Box>
              </Stack>
          </Box>
          
        </Box>
         <Box width="100%" flex={1} maxWidth={326} display="flex" flexDirection="column" gap="20px">
          <Stack
            width="100%"
            p={2}
            direction="column"
            justifyContent="center"
            alignItems="center"
            border="1px solid #E4E4E4"
            borderRadius={2}
          ></Stack>
          <Stack width="100%" mt="25px" direction="row" flexWrap="wrap" gap={2}>
              <CustomButtonEddit
                title={!isCurrentUser ? 'Message' : 'Edit'}
                backgroundColor="#475BE8"
                color="#FCFCFC"
                fullWidth
                icon={!isCurrentUser ? <></> : <Edit />}
                handleEdit={() => {
                  console.log('edit')
                  if (isCurrentUser) {
                    //navigate(`/properties/edit/${propertyDetails._id}`);
                    
                       
                       edit('products', id as string);
                       
                     
                  }
                }}
              />
              <CustomButton
                title={!isCurrentUser ? 'Call' : 'Delete'}
                backgroundColor={!isCurrentUser ? '#2ED480' : '#d42e2e'}
                color="#FCFCFC"
                fullWidth
                icon={!isCurrentUser ? <></> : <Delete />}
                handleClick={() => {
                  if (isCurrentUser) handleDeleteProperty();
                }}
              />
            </Stack>
        
          </Box>
      
      </Box>
     
    </Box>
);
};
