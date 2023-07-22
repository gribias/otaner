import React, { useEffect, useMemo, useState } from 'react'
import { Add } from '@mui/icons-material';
import { useTable } from '@refinedev/core';
import { Box, Stack, TextField, Typography, Select,MenuItem } from "@mui/material";
import { useGo } from "@refinedev/core";
import  {CustomButton}  from 'components/common/customButton';
import ProductCard from 'components/common/ProductCard'
import { useGetIdentity } from "@refinedev/core";
// import { PropertyCard, CustomButton } from 'components'

const Allproducts = () => {
 const go = useGo();
 const { data: user } = useGetIdentity<{
  email: string;
}>();

const [userEmail, setUserEmail] = useState('');

useEffect(() => {
  if (user?.email) {
    setUserEmail(user.email);
  }
}, [user]);

 const {
  tableQueryResult: {data, isLoading, isError},
   current, 
   setCurrent,
  setPageSize,
   pageCount,
   sorter,
   setSorter,
  filters,setFilters
 } = useTable();

const allProducts = useMemo(() => {
  if (userEmail === 'gabrielcorreia94@gmail.com') {
    return data?.data ?? [];
  } else {
    return data?.data.filter((product) => product.userProduct.includes(userEmail)) ?? [];
  }
}, [data, userEmail]);

 const currentCost = sorter.find((item) => item.field === 'cost')?.order;

 const toggleSort = (field: string) => {
  setSorter([{
    field, order: currentCost === 'asc' ? 'desc' : 'asc'
  }])
 }

 const currentFilterValues = useMemo(() => {
  const logicalFilters = filters.flatMap((item) =>('field' in item ? item : []));
  return{
    reference: logicalFilters.find((item) => item.field === 'reference')?.value || '',
    material : logicalFilters.find((item) => item.field === 'material')?.value || '',

  }
 }, [filters])

 if(isLoading) return <Typography> Loading...</Typography>
 if(isError) return <Typography>Error...</Typography>
 

  return (
    <Box>
      <Box mt="20px" sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
        <Stack direction="column" width="100%">
          <Typography fontSize={25} fontWeight={700} color="#11142d">
            {!allProducts.length ?'Sem produtos disponíveis': 'Produtos para venda'} 
          </Typography>
          <Box mb={2} mt={3} display="flex"
          width="84%" justifyContent="space-between" flexWrap="wrap"
          >
            <Box display="flex" gap={2} flexWrap="wrap" mb={{ xs:'20px', sm: 0}}>
            <CustomButton title={`Ordenar por preço ${currentCost === 'asc' ? '↑':'↓'}`}
            handleClick={() => toggleSort('cost')}
            backgroundColor="#475be8"
            color="#fcfcfc"
            />
            <TextField 
            variant='outlined'
            color= "info"
            placeholder="Pesquisar por referência"
            value={currentFilterValues.reference}
            onChange={(e) => {
              setFilters([
              {
                field:'reference',
                operator: 'contains',
                value: e.currentTarget.value ? e.currentTarget.value: undefined
              },
           
            ])
          }}
            />
            <Select
            variant='outlined'
            color="info"
            displayEmpty
            required
            inputProps={{ 'aria-label': 'Without label'}}
            defaultValue=""
            value={currentFilterValues.material}
            onChange={(e) => {
              setFilters([
              {
                field:'material',
                operator: 'eq',
                value: e.target.value
              }
            ], 'replace')
          }}
            >
              <MenuItem value="">All</MenuItem>
              {['gold', 'silver', 'gold/silver'].map((type) =>(
                <MenuItem  key={type} value= {type.toLowerCase()}> {type}</MenuItem>
              ))}
            </Select>
            </Box>

          </Box>
        </Stack>
      </Box>

      <Stack direction="row" justifyContent="space-between" alignItems="center">
      {userEmail === 'gabrielcorreia94@gmail.com' && (
          <CustomButton
            title="Adicionar produto"
            handleClick={() =>
              go({
                to: "/products/create",
              })
            }
            backgroundColor="#475be8"
            color="#fcfcfc"
            icon={<Add />}
          />
        )}
      </Stack>

      <Box mt="20px" sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
        {allProducts?.map((product) => (
          <ProductCard
            key={product._id}
            id={product._id}
            reference={product.reference}
            material={product.material}
            cost={product.cost}
            photo={product.photo}
            // grams = {product.grams}
          />
        ))}
      </Box>

      {allProducts.length > 0 && (
        <Box display="flex" gap={2} mt={3} flexWrap="wrap">
          <CustomButton
          title='Anterior'
          handleClick={() => setCurrent((prev) => prev - 1)}
          backgroundColor="#475be8"
          color="#fcfcfc"
          disabled={!(current > 1)}

          />

          <Box display={{ xs: 'hidden', sm:'flex'}}
          alignItems = "center" gap="5px">
            Página{' '}<strong> {current} de {pageCount}</strong>
          </Box>
          <CustomButton
          title='Próximo'
          handleClick={() => setCurrent((prev) => prev + 1)}
          backgroundColor="#475be8"
          color="#fcfcfc"
          disabled={(current === pageCount)}

          />
          <Select
            variant='outlined'
            color="info"
            displayEmpty
            required
            inputProps={{ 'aria-label': 'Without label'}}
            defaultValue={40}
            onChange={(e) => setPageSize(e.target.value ? Number(e.target.value) : 40 )}
            >
              {[40, 80, 100, 140, 180].map((size) =>(
                 <MenuItem  key={size} value={size}>Mostrar {size}</MenuItem>
              ))}
             
            </Select>
        </Box>
      )}
    </Box>
  );
}

export default Allproducts;