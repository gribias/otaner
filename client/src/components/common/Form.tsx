import React, { useEffect, useState } from 'react';
import {
  Box,
  Stack,
  Typography,
  FormControl,
  FormHelperText,
  TextField,
  TextareaAutosize,
  Select,
  MenuItem,
  Button,
  SelectChangeEvent,
  Checkbox,
  FormControlLabel
} from '@mui/material';


import { FormProps } from 'interfaces/common';
import { CustomButton } from './customButton';
import { fontWeight } from '@mui/system';
import { Controller } from 'react-hook-form';

interface Material {
  type: string;
  grams: number;
}

const Form = ({
  type,
  register,
  handleSubmit,
  handleImageChange,
  formLoading,
  onFinishHandler,
  productImage,
  control
}: FormProps) => {
  const [userProduct, setUserProduct] = useState([]);
  const [material, setMaterials] = useState<Material[]>([
    { type: 'Ouro', grams: 0 },
    { type: 'Prata', grams: 0 }
  ]);


  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedUserProduct, setSelectedUserProduct] = useState<string[]>([]);

  const handleMaterialChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setSelectedMaterials(prevMaterials => {
      if (checked) {
        return [...prevMaterials, name];
      } else {
        return prevMaterials.filter(material => material !== name);
      }
    });
  };

  const handleGramsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setMaterials((prevMaterials) =>
      prevMaterials.map((material) =>
        material.type === name ? { ...material, grams: Number(value) } : material
      )
    );
  };
  

  useEffect(() => {
    // Fetch user IDs
    fetch('https://otaner.onrender.com/api/v1/users')
      .then((response) => response.json())
      .then((data) => {
        // Extract user emails from the response data
        const emails = data.map((user: { email: any }) => user.email);
        console.log('emails', emails);
        setUserProduct(emails);
      })
      .catch((error) => {
        console.error('Error fetching user IDs:', error);
      });
  }, []);

  const handleUserProductChange = (event: SelectChangeEvent<unknown>) => {
    const { value } = event.target;
    setSelectedUserProduct(value as string[]);
  };

  return (
    <Box>
      <Typography fontSize={25} fontWeight={700} color="#11142d">
        {type} a product
      </Typography>

      <Box mt={2.5} borderRadius="15px" padding="20px" bgcolor="#fcfcfc">
        <form
          style={{
            marginTop: '20px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}
          onSubmit={handleSubmit(onFinishHandler)}
        >
          <FormControl>
            <FormHelperText
              sx={{
                fontWeight: 500,
                margin: '10px',
                fontSize: 16,
                color: '#11142d'
              }}
            >
              Nome da referencia
            </FormHelperText>
            <TextField
              fullWidth
              required
              id="outlined-basic"
              color="info"
              variant="outlined"
              {...register('reference', {
                required: true
              })}
            />
          </FormControl>
          <FormControl>
            <FormHelperText
              sx={{
                fontWeight: 500,
                margin: '10px',
                fontSize: 16,
                color: '#11142d'
              }}
            >
              Descrição
            </FormHelperText>
            <TextareaAutosize
              minRows={5}
              placeholder="Escreva aqui a descrição do produto (interno)"
              color="info"
              style={{
                width: '100%',
                background: 'transparent',
                fontSize: '16px',
                borderColor: 'rgba(0,0,0,0.23)',
                borderRadius: 6,
                padding: 10,
                color: '#919191'
              }}
              {...register('description', {
                required: false
              })}
            />
          </FormControl>
          <Stack direction="row" gap={4}>
          <Box>
    {/* Your existing JSX code */}
    <FormControl>
  <FormHelperText
    sx={{
      fontWeight: 500,
      margin: '10px',
      fontSize: 16,
      color: '#11142d'
    }}
  >
    Tipo de material
  </FormHelperText>
  {material.map((material) => (
    <Stack key={material.type} direction="row" alignItems="center" gap={2}>
      <Checkbox
        name={material.type}
        checked={selectedMaterials.includes(material.type)}
        onChange={handleMaterialChange}
      />
      <Typography>{material.type}</Typography>
      {selectedMaterials.includes(material.type) && (
        <Controller
          name={`material.${material.type}.grams`}
          control={control}
          defaultValue={0}
          render={({ field }) => (
            <TextField
              fullWidth
              required
              id={material.type}
              color="info"
              type="number"
              variant="outlined"
              {...field}
            />
          )}
        />
      )}
    </Stack>
  ))}
</FormControl>
    {/* Rest of your JSX code */}
  </Box>
            {/* <FormControl>
              <FormHelperText
                sx={{
                  fontWeight: 500,
                  margin: '10px',
                  fontSize: 16,
                  color: '#11142d'
                }}
              >
                {' '}
                gr
              </FormHelperText>
              <TextField
                fullWidth
                required
                id="outlined-basic"
                color="info"
                type="number"
                variant="outlined"
                {...register('grams', {
                  required: true
                })}
              />
            </FormControl> */}
            {/* Add the dropdown for user IDs */}
            <FormControl>
              <FormHelperText
                sx={{
                  fontWeight: 500,
                  margin: '10px',
                  fontSize: 16,
                  color: '#11142d'
                }}
              >
               Selecionar email do cliente
              </FormHelperText>
              <Controller
                name="userProduct"
                control={control}
                defaultValue={[]}
                render={({ field }) => (
                  <Select
                    variant="outlined"
                    color="info"
                    required
                    inputProps={{
                      'aria-label': 'Without label'
                    }}
                    multiple
                    {...field}
                  >
                    {userProduct.map((id) => (
                      <MenuItem key={id} value={id}>
                        {id}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
          </Stack>
          <FormControl>
            <FormHelperText
              sx={{
                fontWeight: 500,
                margin: '10px',
                fontSize: 16,
                color: '#11142d'
              }}
            >
              Preço
            </FormHelperText>
            <TextField
              fullWidth
              required
              id="outlined-basic"
              color="info"
              type="number"
              variant="outlined"
              {...register('cost', {
                required: true
              })}
            />
          </FormControl>
          <Stack direction="column" gap={1} justifyContent="center" mb={2}>
            <Stack direction="row" gap={2}>
              <Typography color="#11142d" fontSize={16} fontWeight={500} my="10px">
                Imagem do produto
              </Typography>
              <Button
                component="label"
                sx={{
                  width: 'fit-content',
                  color: '#2ed480',
                  textTransform: 'capitalize',
                  fontSize: 16
                }}
              >
                Upload *
                <input
                  hidden
                  accept="image/*"
                  type="file"
                  onChange={(e) => {
                    //@ts-ignore
                    handleImageChange(e.target.files[0]);
                  }}
                />
              </Button>
            </Stack>
            <Typography fontSize={14} color="#808191" sx={{ wordBreak: 'break-all' }}>
              {productImage?.name}
            </Typography>
          </Stack>
          <CustomButton
            type="submit"
            title={formLoading ? 'Submitting...' : 'Submit'}
            backgroundColor="#475be8"
            color="#fcfcfc"
          />
        </form>
      </Box>
    </Box>
  );
};

export default Form;
