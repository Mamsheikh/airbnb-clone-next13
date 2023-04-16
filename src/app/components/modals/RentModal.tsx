'use client';
import { useMemo, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';

import useRentModal from '@/app/hooks/useRentModal';

import Modal from './Modal';
import Heading from '../Heading';
import { categories } from '../navbar/Categories';
import CategoryInput from '../inputs/CategoryInput';

enum STEPS {
  CATEGORY = 0,
  LOCATION = 1,
  INFO = 2,
  IMAGES = 3,
  DESCRIPTION = 4,
  PRICE = 5,
}

const RentModal: React.FC = () => {
  const rentModal = useRentModal();

  const [step, setStep] = useState(STEPS.CATEGORY);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      category: '',
      lacation: null,
      guestCount: 1,
      bathroomCount: 1,
      imageSrc: [],
      price: 1,
      title: '',
      description: '',
    },
  });

  const category = watch('category');

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const onBack = () => {
    setStep((value) => value - 1);
  };

  const onNext = () => {
    setStep((prev) => prev + 1);
  };

  const actionLabel = useMemo(() => {
    if (step === STEPS.PRICE) {
      return 'Create';
    }
    return 'Next';
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.CATEGORY) {
      return undefined;
    }

    return 'Back';
  }, [step]);

  let bodyContent = (
    <div className='flex flex-col gap-8'>
      <Heading
        title='Which of these best describes your place?'
        subtitle='Pick a category'
      />
      <div className='grid grid-cols-1 md:grid-cols-2 gap-3 overflow-y-auto max-h-[50vh]'>
        {categories.map((item) => (
          <div key={item.label} className='col-span-1'>
            <CategoryInput
              icon={item.icon}
              label={item.label}
              onClick={(category) => setCustomValue('category', category)}
              selected={category === item.label}
            />
          </div>
        ))}
      </div>
    </div>
  );
  return (
    <Modal
      isOpen={rentModal.isOpen}
      onClose={rentModal.onClose}
      onSubmit={rentModal.onClose}
      actionLabel={actionLabel}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
      title='Airbnb your home'
      body={bodyContent}
    />
  );
};
export default RentModal;
