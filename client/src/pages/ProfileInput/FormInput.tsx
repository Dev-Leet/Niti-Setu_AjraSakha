import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@store/hooks';
import { createProfile } from '@store/slices/profileSlice';
import { checkEligibility } from '@store/slices/eligibilitySlice';
import { profileSchema, ProfileInput as ProfileData } from '@utils/validators';
import { Input } from '@components/common/Input/Input';
import { Button } from '@components/common/Button/Button';
import styles from './ProfileInput.module.css';

const stateDistrictMap: Record<string, string[]> = {
  AndhraPradesh: ['Visakhapatnam','Vijayawada','Guntur','Nellore','Kurnool','Anantapur','Chittoor',],
  ArunachalPradesh: ['Itanagar', 'Tawang', 'Ziro', 'Pasighat', 'Bomdila'],
  Assam: ['Guwahati', 'Dibrugarh', 'Silchar', 'Jorhat', 'Nagaon', 'Tezpur'],
  Bihar: ['Patna', 'Gaya', 'Muzaffarpur', 'Bhagalpur', 'Darbhanga', 'Purnia'],
  Chhattisgarh: ['Raipur', 'Bilaspur', 'Durg', 'Korba', 'Rajnandgaon'],
  Goa: ['North Goa', 'South Goa'],
  Gujarat: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar'],
  Haryana: ['Gurugram', 'Faridabad', 'Panipat', 'Ambala', 'Hisar', 'Rohtak'],
  HimachalPradesh: ['Shimla', 'Kullu', 'Manali', 'Dharamshala', 'Solan'],
  Jharkhand: ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Hazaribagh'],
  Karnataka: ['Bengaluru', 'Mysuru', 'Hubballi', 'Belagavi', 'Mangaluru', 'Shivamogga'],
  Kerala: ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Alappuzha'],
  MadhyaPradesh: ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar'],
  Maharashtra: ['Mumbai','Pune','Nagpur','Nashik','Kolhapur','Satara','Solapur','Aurangabad',],
  Manipur: ['Imphal East', 'Imphal West', 'Thoubal', 'Churachandpur'],
  Meghalaya: ['Shillong', 'Tura', 'Jowai', 'Nongpoh'],
  Mizoram: ['Aizawl', 'Lunglei', 'Champhai'],
  Nagaland: ['Kohima', 'Dimapur', 'Mokokchung'],
  Odisha: ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Sambalpur', 'Puri'],
  Punjab: ['Amritsar', 'Ludhiana', 'Jalandhar', 'Patiala', 'Bathinda'],
  Rajasthan: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer', 'Bikaner'],
  Sikkim: ['Gangtok', 'Namchi', 'Gyalshing'],
  TamilNadu: ['Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Tiruchirappalli'],
  Telangana: ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar'],
  Tripura: ['Agartala', 'Udaipur', 'Dharmanagar'],
  UttarPradesh: ['Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Prayagraj', 'Meerut'],
  Uttarakhand: ['Dehradun', 'Haridwar', 'Nainital', 'Almora'],
  WestBengal: ['Kolkata', 'Howrah', 'Darjeeling', 'Siliguri', 'Durgapur'],
};

export const FormInput: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
  });

  const selectedState = watch('state');

  const onSubmit = async (data: ProfileData) => {
    const profilePayload = {
      ...data,
      landholding: {
        totalArea: data.totalArea,
        ownershipType: 'owned',
      },
    };

    const profileResult = await dispatch(createProfile(profilePayload));
    if (createProfile.fulfilled.match(profileResult)) {
      await dispatch(checkEligibility(profileResult.payload.id));
      navigate('/results');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      {/* FULL NAME (unchanged) */}
      <Input
        label="Full Name"
        placeholder="Enter your name"
        error={errors.fullName?.message}
        {...register('fullName')}
        fullWidth
      />

      {/* STATE & DISTRICT (UPDATED ONLY THIS PART) */}
      <div className={styles.row}>
        <div className={styles.field}>
          <label>State</label>
          <select
            {...register('state')}
            className={styles.select}
            onChange={(e) => {
              setValue('state', e.target.value);
              setValue('district', ''); // reset district on state change
            }}
          >
            <option value="">Select state</option>
            {Object.keys(stateDistrictMap).map((state) => (
              <option key={state} value={state}>
                {state.replace(/([A-Z])/g, ' $1').trim()}
              </option>
            ))}
          </select>
          {errors.state && <span className={styles.error}>{errors.state.message}</span>}
        </div>

        <div className={styles.field}>
          <label>District</label>
          <select {...register('district')} className={styles.select} disabled={!selectedState}>
            <option value="">Select district</option>
            {selectedState &&
              stateDistrictMap[selectedState]?.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
          </select>
          {errors.district && <span className={styles.error}>{errors.district.message}</span>}
        </div>
      </div>

      {/* PINCODE (unchanged) */}
      <div className={styles.row}>
        <Input
          label="Pincode"
          placeholder="123456"
          error={errors.pincode?.message}
          {...register('pincode')}
          fullWidth
        />

        <Input
          label="Total Land (acres)"
          type="number"
          step="0.01"
          placeholder="5.5"
          error={errors.totalArea?.message}
          {...register('totalArea', { valueAsNumber: true })}
          fullWidth
        />
      </div>

      {/* CROPS (unchanged) */}
      <div className={styles.field}>
        <label>Crop Types</label>
        <select {...register('cropTypes')} multiple className={styles.select}>
          <option value="rice">Rice</option>
          <option value="wheat">Wheat</option>
          <option value="cotton">Cotton</option>
          <option value="sugarcane">Sugarcane</option>
          <option value="maize">Maize</option>
        </select>
        {errors.cropTypes && <span className={styles.error}>{errors.cropTypes.message}</span>}
      </div>

      {/* CATEGORY (unchanged) */}
      <div className={styles.field}>
        <label>Social Category</label>
        <select {...register('socialCategory')} className={styles.select}>
          <option value="General">General</option>
          <option value="OBC">OBC</option>
          <option value="SC">SC</option>
          <option value="ST">ST</option>
        </select>
        {errors.socialCategory && (
          <span className={styles.error}>{errors.socialCategory.message}</span>
        )}
      </div>

      <Button type="submit" variant="primary" size="lg" fullWidth loading={isSubmitting}>
        Check Eligibility
      </Button>
    </form>
  );
};
