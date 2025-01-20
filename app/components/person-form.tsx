import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { z } from 'zod';

const formSchema = z.object({
  tcKimlikNo: z.string().length(11, 'TC Kimlik No 11 haneli olmalıdır'),
  ePosta: z.string().email('Geçerli bir e-posta adresi giriniz'),
  telefon: z.string().min(10, 'Telefon numarası en az 10 karakter olmalıdır'),
  sehir: z.string().min(2, 'Şehir adı en az 2 karakter olmalıdır'),
  adres: z.string().min(5, 'Adres en az 5 karakter olmalıdır'),
  calistigiSirket: z.string().optional(),
  pozisyon: z.string().optional(),
  islemYapi: z.string().optional()
});

const PersonForm = () => {
  const [formData, setFormData] = useState({
    tcKimlikNo: '',
    ePosta: '',
    telefon: '',
    sehir: '',
    adres: '',
    calistigiSirket: '',
    pozisyon: '',
    islemYapi: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);
    
    try {
      const validatedData = formSchema.parse(formData);
      
      const response = await fetch('/api/person', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedData)
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          setErrors({ ePosta: 'Bu e-posta adresi zaten kullanımda' });
          toast.error('Bu e-posta adresi zaten kullanımda');
          return;
        }
        throw new Error(data.message || 'Form gönderimi başarısız oldu');
      }

      toast.success('Bilgiler başarıyla kaydedildi');
      // Form sıfırlama
      setFormData({
        tcKimlikNo: '',
        ePosta: '',
        telefon: '',
        sehir: '',
        adres: '',
        calistigiSirket: '',
        pozisyon: '',
        islemYapi: ''
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      }
      toast.error('Lütfen form alanlarını kontrol ediniz');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="tcKimlikNo" className="block text-sm font-medium">TC Kimlik No</label>
        <input
          id="tcKimlikNo"
          name="tcKimlikNo"
          type="text"
          value={formData.tcKimlikNo}
          onChange={(e) => setFormData(prev => ({ ...prev, tcKimlikNo: e.target.value }))}
          className={`w-full p-2 border rounded-md ${errors.tcKimlikNo ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.tcKimlikNo && <p className="text-red-500 text-sm">{errors.tcKimlikNo}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="ePosta" className="block text-sm font-medium">E-posta</label>
        <input
          id="ePosta"
          name="ePosta"
          type="email"
          value={formData.ePosta}
          onChange={(e) => setFormData(prev => ({ ...prev, ePosta: e.target.value }))}
          className={`w-full p-2 border rounded-md ${errors.ePosta ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.ePosta && <p className="text-red-500 text-sm">{errors.ePosta}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="telefon" className="block text-sm font-medium">Telefon</label>
        <input
          id="telefon"
          name="telefon"
          type="tel"
          value={formData.telefon}
          onChange={(e) => setFormData(prev => ({ ...prev, telefon: e.target.value }))}
          className={`w-full p-2 border rounded-md ${errors.telefon ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.telefon && <p className="text-red-500 text-sm">{errors.telefon}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="sehir" className="block text-sm font-medium">Şehir</label>
        <input
          id="sehir"
          name="sehir"
          type="text"
          value={formData.sehir}
          onChange={(e) => setFormData(prev => ({ ...prev, sehir: e.target.value }))}
          className={`w-full p-2 border rounded-md ${errors.sehir ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.sehir && <p className="text-red-500 text-sm">{errors.sehir}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="adres" className="block text-sm font-medium">Adres</label>
        <textarea
          id="adres"
          name="adres"
          value={formData.adres}
          onChange={(e) => setFormData(prev => ({ ...prev, adres: e.target.value }))}
          className={`w-full p-2 border rounded-md ${errors.adres ? 'border-red-500' : 'border-gray-300'}`}
          rows={3}
        />
        {errors.adres && <p className="text-red-500 text-sm">{errors.adres}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="calistigiSirket" className="block text-sm font-medium">Çalıştığı Şirket</label>
        <input
          id="calistigiSirket"
          name="calistigiSirket"
          type="text"
          value={formData.calistigiSirket}
          onChange={(e) => setFormData(prev => ({ ...prev, calistigiSirket: e.target.value }))}
          className="w-full p-2 border rounded-md border-gray-300"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="pozisyon" className="block text-sm font-medium">Pozisyon</label>
        <input
          id="pozisyon"
          name="pozisyon"
          type="text"
          value={formData.pozisyon}
          onChange={(e) => setFormData(prev => ({ ...prev, pozisyon: e.target.value }))}
          className="w-full p-2 border rounded-md border-gray-300"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="islemYapi" className="block text-sm font-medium">İşlem Yapı</label>
        <input
          id="islemYapi"
          name="islemYapi"
          type="text"
          value={formData.islemYapi}
          onChange={(e) => setFormData(prev => ({ ...prev, islemYapi: e.target.value }))}
          className="w-full p-2 border rounded-md border-gray-300"
        />
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          disabled={isSubmitting}
          className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
        >
          İptal
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
      </div>
    </form>
  );
};

export default PersonForm; 