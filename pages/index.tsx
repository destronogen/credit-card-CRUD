import React from 'react';
import swal from 'sweetalert';
import { usePaymentInputs, PaymentInputsWrapper } from 'react-payment-inputs';
// @mui
import {
	Alert,
	AlertTitle,
	Autocomplete,
	Box,
	Button,
	Grid,
	List,
	ListItem,
	ListItemText,
	IconButton,
	Typography,
	Paper,
	TextField,
	useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
// @icons
import { Add, Delete } from '@mui/icons-material';
// @style
import useStyles from './styles';
// @local
import { countries } from './data';

interface ICardProps {
	id?: number;
	typeCard: string;
	numberCard: string | number;
	expirationCard: string | number;
	cvvCard: string | number;
}

const LandingPage = () => {
	// Unused, but keeping classes here as I make use of JSS to style components
	const classes = useStyles();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));
	const [bannedCountries, setBannedCountries] = React.useState(
		[] as string[]
	);
	const [validCreditCards, setValidCreditCards] = React.useState(
		[] as Array<ICardProps>
	);
	const [selectedCountryForCreditCard, setSelectedCountryForCreditCard] =
		React.useState<string | null>(null);

	const [cardNumberState, setCardNumberState] = React.useState(null);
	const [cardExpiryDateState, setCardExpiryDateState] = React.useState(null);
	const [cardCvvState, setCardCvvState] = React.useState(null);
	const [typeOfCardState, setTypeOfCardState] = React.useState(null);
	const {
		wrapperProps,
		meta,
		getCardNumberProps,
		getExpiryDateProps,
		getCVCProps,
		getCardImageProps,
		cardNumber,
		cardExpiration,
		cardCVV,
	} = usePaymentInputs();

	React.useEffect(() => {
		if (meta.cardType && meta.cardType.displayName) {
			setTimeout(
				() => setTypeOfCardState(meta.cardType.displayName),
				2000
			);
		}
	}, [meta?.cardType?.displayName]);

	const handleChangeCardNumber = (event) => {
		setTimeout(() => setCardNumberState(event.target.value), 1000);
	};

	const handleChangeExpiryDate = (event) => {
		setTimeout(() => setCardExpiryDateState(event.target.value), 1000);
	};

	const handleChangeCVC = (event) => {
		setTimeout(() => setCardCvvState(event.target.value), 1000);
	};

	const removeCreditCard = (id: number) => {
		swal({
			title: 'Are you sure?',
			text: 'Once removed, you will not be able to recover this credit card.',
			icon: 'warning',
			buttons: [true, true],
			dangerMode: true,
		}).then((willDelete) => {
			if (willDelete) {
				const filtered = validCreditCards.filter((n) => n.id !== id);

				setValidCreditCards(filtered);
			}
		});
	};

	const columns: GridColDef[] = [
		{ field: 'id', headerName: 'ID', width: 90 },
		{
			field: 'typeCard',
			headerName: 'Card Type',
			width: 150,
			editable: false,
		},
		{
			field: 'numberCard',
			headerName: 'Card Number',
			width: 200,
			editable: false,
		},
		{
			field: 'expirationCard',
			headerName: 'Card Expiration',
			width: 200,
			editable: false,
		},
		{
			field: 'cvvCard',
			headerName: 'Card CVV',
			width: 200,
			editable: false,
		},
		{
			field: 'deleteCard',
			headerName: '',
			width: 75,
			renderCell(params) {
				return (
					<IconButton
						onClick={() => removeCreditCard(Number(params.id))}
					>
						<Delete htmlColor="red" />
					</IconButton>
				);
			},
		},
	];

	const rows = validCreditCards;

	const addCreditCard = (
		typeCard: string | null,
		numberCard: number | string,
		expirationCard: string | number,
		cvvCard: string | number
	) => {
		const newCreditCard = {
			id: validCreditCards.length + 1,
			typeCard,
			numberCard,
			expirationCard,
			cvvCard,
		};

		const creditCardExists = validCreditCards.filter(
			(c) => c.numberCard === newCreditCard.numberCard
		);

		if (creditCardExists.length > 0) {
			alert(
				'You cannot add the same credit card. Please enter different card details'
			);
		} else {
			setValidCreditCards((validCreditCard) => [
				...validCreditCards,
				newCreditCard,
			]);
			alert('Credit card added :)');
		}
	};

	const handleCountrySelectToAddCreditCard = (
		event: React.ChangeEvent<HTMLInputElement>,
		values: any
	) => {
		if (values && values.label) {
			setSelectedCountryForCreditCard(values.label);
		}
	};

	const handleBannedCountryAdd = (
		event: React.ChangeEvent<HTMLInputElement>,
		values: any
	) => {
		if (values && values.label) {
			if (bannedCountries.includes(values.label)) {
				alert('Banned country already exists');
			} else if (!bannedCountries.includes(values.label)) {
				setBannedCountries((bannedCountryState) => [
					...bannedCountryState,
					values.label,
				]);

				alert('Banned country added :)');
			}
		}
	};

	const removeBannedCountry = (text: string) => {
		swal({
			title: 'Are you sure?',
			text: 'Once removed, you will not be able to recover this country.',
			icon: 'warning',
			buttons: [true, true],
			dangerMode: true,
		}).then((willDelete) => {
			if (willDelete) {
				const filtered = bannedCountries.filter((n) => n !== text);
				setBannedCountries(filtered);
				alert('Banned country removed :)');
			}
		});
	};

	const submitButtonDisabled =
		(cardNumberState == null || cardNumberState === '') &&
		(cardExpiryDateState == null || cardExpiryDateState === '') &&
		(cardCvvState == null || cardCvvState === '');

	const creditCardInputsDisabled =
		selectedCountryForCreditCard == null &&
		bannedCountries.includes(selectedCountryForCreditCard);

	const NoCreditCardsInformation = () => {
		return (
			<Alert severity="info">
				There are no valid credit cards —{' '}
				<strong>please add a valid credit card</strong>
			</Alert>
		);
	};

	const NoBannedCountriesInformation = () => {
		return (
			<Alert severity="info">
				There are no banned countries —{' '}
				<strong>please add a banned country</strong>
			</Alert>
		);
	};

	const BannedCountryWarning = () => {
		return (
			<Alert severity="warning">
				This is a banned country —{' '}
				<strong>please select a different country</strong>
			</Alert>
		);
	};

	const backgroundImageColor = '#eeeeee';

	return (
		<Grid
			container
			spacing={2}
			sx={{
				backgroundColor: backgroundImageColor,
			}}
		>
			<Grid item md={6} xs={12}>
				<Paper variant="outlined" sx={{ padding: 3, height: 300 }}>
					<Grid container spacing={2} justifyContent="center">
						<Grid item xs={12} md={5}>
							<Autocomplete
								id="country-select"
								sx={{
									width: 300,
									marginBottom: 5,
								}}
								options={countries}
								autoHighlight
								onChange={handleCountrySelectToAddCreditCard}
								getOptionLabel={(option) => option.label}
								renderOption={(props, option) => (
									<Box
										component="li"
										sx={{
											'& > img': { mr: 2, flexShrink: 0 },
										}}
										{...props}
									>
										<img
											loading="lazy"
											width="20"
											src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
											srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
											alt=""
										/>
										{option.label} ({option.code}) +
										{option.phone}
									</Box>
								)}
								renderInput={(params) => (
									<TextField
										{...params}
										label="Select a country"
										inputProps={{
											...params.inputProps,
											autoComplete: 'new-country',
										}}
									/>
								)}
							/>
							<PaymentInputsWrapper {...wrapperProps}>
								<input
									{...getCardNumberProps({
										onChange: handleChangeCardNumber,
									})}
									value={cardNumber}
									disabled={
										selectedCountryForCreditCard == null
									}
								/>
								<input
									{...getExpiryDateProps({
										onChange: handleChangeExpiryDate,
									})}
									value={cardExpiration}
									disabled={
										selectedCountryForCreditCard == null
									}
								/>
								<input
									{...getCVCProps({
										onChange: handleChangeCVC,
									})}
									value={cardCVV}
									disabled={
										selectedCountryForCreditCard == null
									}
								/>
							</PaymentInputsWrapper>

							<Button
								variant="contained"
								color="primary"
								fullWidth={isMobile ? true : false}
								disabled={submitButtonDisabled}
								onClick={() =>
									addCreditCard(
										typeOfCardState,
										cardNumberState,
										cardExpiryDateState,
										cardCvvState
									)
								}
								sx={{ marginTop: 5 }}
							>
								SUBMIT CARD
							</Button>
						</Grid>
						<Grid item xs={12} md={7}>
							{bannedCountries.includes(
								selectedCountryForCreditCard
							) ? (
								<BannedCountryWarning />
							) : null}
						</Grid>
					</Grid>
				</Paper>

				<Paper
					variant="outlined"
					sx={{
						padding: 3,
						height: 300,
						marginTop: 2,
					}}
				>
					<Autocomplete
						id="country-select"
						sx={{ width: 300, marginTop: 3, marginBottom: 3 }}
						options={countries}
						autoHighlight
						onChange={handleBannedCountryAdd}
						getOptionLabel={(option) => option.label}
						renderOption={(props, option) => (
							<Box
								component="li"
								sx={{
									'& > img': {
										mr: 2,
										flexShrink: 0,
									},
								}}
								{...props}
							>
								<img
									loading="lazy"
									width="20"
									src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
									srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
									alt=""
								/>
								{option.label} ({option.code}) +{option.phone}
							</Box>
						)}
						renderInput={(params) => (
							<TextField
								{...params}
								label="Select a country to add"
								inputProps={{
									...params.inputProps,
									autoComplete: 'new-country',
								}}
							/>
						)}
					/>
					{bannedCountries.length <= 0 ? (
						<NoBannedCountriesInformation />
					) : (
						<List
							sx={{
								width: '100%',
								maxHeight: '190px',
								overflow: 'auto',
								border: '0.5px solid #e0e0e0',
								borderRadius: '5px',
							}}
						>
							{bannedCountries.map((n) => (
								<ListItem
									key={n}
									secondaryAction={
										<IconButton
											edge="end"
											aria-label="delete"
											onClick={() =>
												removeBannedCountry(n)
											}
										>
											<Delete htmlColor="red" />
										</IconButton>
									}
								>
									<ListItemText primary={n} />
								</ListItem>
							))}
						</List>
					)}
				</Paper>
			</Grid>
			<Grid item md={6} xs={12}>
				<Grid item md={12} xs={12}>
					<Box sx={{ height: 350, width: '100%' }}>
						<DataGrid
							rows={rows}
							columns={columns}
							initialState={{
								pagination: {
									paginationModel: {
										pageSize: 5,
									},
								},
							}}
							pageSizeOptions={[]}
							disableRowSelectionOnClick
							disableColumnMenu
							sx={{ backgroundColor: 'white' }}
							slots={{
								noRowsOverlay: NoCreditCardsInformation,
							}}
						/>
					</Box>
				</Grid>
			</Grid>
		</Grid>
	);
};
export default LandingPage;
