  import { DataGrid, GridCellParams, GridColDef } from "@mui/x-data-grid";
  import { useGetIdentity, useNavigation, useShow, useUpdate } from "@refinedev/core";
  import React from "react";
  import { Avatar, Box, Button, Card, CardContent, CardHeader, Stack, Step, StepLabel, Stepper, Typography } from "@mui/material";
  import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
  import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";import Dialog from "@mui/material/Dialog";
  import DialogTitle from "@mui/material/DialogTitle";
  import DialogContent from "@mui/material/DialogContent";
  import DialogActions from "@mui/material/DialogActions";



  interface IOrder {
    _id: string;
    user: string;
    orderDate: string;
    orderNumber: string;
    status:{
      dateStarted: Date;
      dateFinished: Date;
      text: string;
      userStarted: string;
      userFinished: string;
    };
    NumberArticles: number;
    Total: number;
    products: {
      product: {
        _id: string;
        reference: string;
        material: string;
        cost: number;
        photo: string;
      };
      quantity: number;
      _id: string;
      size: string | null;
    }[];
    creator: string;
    grams: object;
    __v: number;
  }

  export const OrderShow: React.FC = () => {
    const { queryResult } = useShow<IOrder>();

    const record = queryResult.data?.data;
    
    console.log(queryResult, "show order queryResult");
    const canAcceptOrder = record?.status.text === "Pending";
    const canFinishOrder = record?.status.text === "Inprogress";
    const isOrderFinished = record?.status.text === "Ready";
    const { goBack } = useNavigation();
    const { mutate } = useUpdate();
    const { data: user } = useGetIdentity() as { data: { name: string } };

    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [selectedImage, setSelectedImage] = React.useState("");

    const handleOpenModal = (imageUrl: React.SetStateAction<string>) => {
      console.log(imageUrl);
      setSelectedImage(imageUrl);
      setIsModalOpen(true);
    };


    const columns: GridColDef[] = [
      {
        field: "Photo",
        headerName: "Photo",
        width: 150,
        renderCell: (params: GridCellParams) => (
          <Stack direction="row" spacing={4} alignItems="center">
            <Avatar
              sx={{ width: 108, height: 108 }}
              src={params.row._id.photo}
              onClick={() => handleOpenModal(params.row._id.photo)}
            />
          </Stack>
        ),
      },
      {
        field: "product",
        headerName: "Reference",
        width: 150,
        renderCell: (params: GridCellParams) => (
          <Typography variant="body1" whiteSpace="break-spaces">
            {params.row._id.reference}
          </Typography>
        ),
      },
      // {
      //   field: "product.material",
      //   headerName: "Material",
      //   width: 150,
      //   renderCell: (params: GridCellParams) => (
      //     <Typography variant="body1">{params.row._id.material}</Typography>
      //   ),
      // },
      // {
      //   field: "product.cost",
      //   headerName: "Cost",
      //   type: "number",
      //   width: 100,
      //   renderCell: (params: GridCellParams) => (
      //     <Typography variant="body1">{params.row._id.cost}</Typography>
      //   ),
      // },
      {
        field: "quantity",
        headerName: "Quantity",
        type: "number",
        width: 100,
        renderCell: (params: GridCellParams) => (
          <Typography variant="body1">{params.row.quantity}</Typography>
        ),
      },
      {
        field: "size",
        headerName: "Size",
        width: 100,
        renderCell: (params: GridCellParams) => (
          <Typography variant="body1">{params.row.size}</Typography>
        ),
      },
    ];
    

    const CustomFooter = () => (
      <Stack direction="row" spacing={4} justifyContent="flex-end" p={1}>
        <Typography sx={{ color: "primary.main" }} fontWeight={700}>
          Total gramas
        </Typography>
        {record?.grams &&
          Object.entries(record.grams).map(([material, grams]) => (
            <Typography key={material}>{`${material}: ${grams}`}</Typography>
          ))}
      </Stack>
    );

    const handleMutate = (status: object ) => {
      if (record) {
          mutate({
              resource: "orders",
              id: record._id.toString(),
              values: {
                  status,
              },
              mutationMode: "pessimistic",
          });
      }
  };

  function changeTimeZone(){

      return new Date().toLocaleString('en-GB', {
          timeZone: 'Europe/London',
          dateStyle: 'short',
          timeStyle: 'short',
      })
  }

  // Modal component
  const ImageModal = () => (
    <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
      <DialogTitle>Larger Image</DialogTitle>
      <DialogContent>
        <Box width={400} height={400}>
          <img src={selectedImage} alt="Larger" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsModalOpen(false)}>Close</Button>
      </DialogActions>
    </Dialog>
  );



    
    return (
      <Stack spacing={2}>
          <Card>
                  <CardHeader
                      sx={{
                          width: "100%",
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 2,
                      }}
                      title={
                          <Stack direction="row" alignItems="center" spacing={1}>
                              <Typography variant="h6">
                              Número de encomenda
                              </Typography>
                              <Typography variant="caption">{`#${
                                  record?.orderNumber ?? ""
                              }`}</Typography>
                          </Stack>
                      }
                      // avatar={
                      //     <IconButton onClick={goBack}>
                      //         <ArrowBackIcon />
                      //     </IconButton>
                      // }
                      action={
                          <Stack direction="row" spacing={2}>
                              <Button
                                  disabled={!canAcceptOrder}
                                  variant="outlined"
                                  size="small"
                                  startIcon={<CheckOutlinedIcon />}
                                  onClick={() =>
                                      handleMutate({
                                          dateStarted: changeTimeZone(),
                                          text: "Inprogress",
                                          userStarted: user.name,
      

                                      })
                                  }
                              >
                              {canAcceptOrder ? 'Iniciar produção' : `Iniciado em ${record?.status.dateStarted} por  ${record?.status.userStarted}`}
                              </Button>
                              {canFinishOrder && (
                              <Button
                                  disabled={!canFinishOrder}
                                  variant="outlined"
                                  size="small"
                                  color="success"
                                  startIcon={
                                      <CloseOutlinedIcon sx={{ bg: "red" }} />
                                  }
                                  onClick={() =>
                                      handleMutate({
                                          ...record?.status,
                                          dateFinished: changeTimeZone(),
                                          text: "Ready",
                                          userFinished: user.name
                                      })
                                  }
                              >
                                {canFinishOrder ? 'Concluir produçao' : ``}
                              </Button>
                              )}
                          {isOrderFinished && (
                              <Button
                                  disabled={true}
                                  variant="outlined"
                                  size="small"
                                  color="info"
                                  startIcon={
                                      <CloseOutlinedIcon sx={{ bg: "red" }} />
                                  }>
                              {isOrderFinished ? `Concluido em ${record?.status.dateFinished} por  ${record?.status.userFinished}` : ``}
                              </Button>
                          )}
                          </Stack>
                      }
                  />
                  <CardContent>
                      {/* <Stepper
                          nonLinear
                          activeStep={record?.events.findIndex(
                              (el) => el.status === record?.status?.text,
                          )}
                          orientation={isSmallOrLess ? "vertical" : "horizontal"}
                      >
                          {record?.events.map((event: IEvent, index: number) => (
                              <Step key={index}>
                                  <StepLabel
                                      optional={
                                          <Typography variant="caption">
                                              {event.date &&
                                                  dayjs(event.date).format(
                                                      "L LT",
                                                  )}
                                          </Typography>
                                      }
                                      error={event.status === "Cancelled"}
                                  >
                                      {event.status}
                                  </StepLabel>
                              </Step>
                          ))}
                      </Stepper> */}
                  </CardContent>
              </Card>
      <div style={{ height: 300, width: "100%" }}>
        <DataGrid
          autoHeight
          rows={record?.products ?? []}
          columns={columns}
          getRowId={(row) => row._id._id}
          hideFooterPagination
          rowHeight={124}
          components={{
              Footer: CustomFooter,
          }}
        />
      </div>
      <ImageModal />
      </Stack>
    );
  };

