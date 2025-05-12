import React, { useState, useEffect } from 'react';
import { Riddle } from '../types';
import { createRiddle, updateRiddle } from '../services/apiService';

interface RiddleFormProps {
  riddle?: Riddle | null;
  onSuccess: () => void;
}

export const RiddleForm: React.FC<RiddleFormProps> = ({ riddle, onSuccess }) => {
  const [formData, setFormData] = useState({
    id: 0,
    question: '',
    answer: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (riddle) {
      setFormData({
        id: riddle.id,
        question: riddle.question,
        answer: riddle.answer
      });
    } else {
      setFormData({
        id: 0,
        question: '',
        answer: ''
      });
    }
  }, [riddle]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      if (formData.question.trim() === '' || formData.answer.trim() === '') {
        throw new Error('La pregunta y respuesta son obligatorias.');
      }
      
      if (riddle?.id) {
        await updateRiddle(formData as Riddle);
      } else {
        await createRiddle(formData as Riddle);
      }
      
      setFormData({
        id: 0,
        question: '',
        answer: ''
      });
      
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar la adivinanza.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input type="hidden" name="id" value={formData.id} />
      
      {error && (
        <div className="bg-red-500 bg-opacity-20 text-red-100 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}
      
      <div className="mb-4">
        <label htmlFor="question" className="block text-sm font-medium mb-1">
          Pregunta / Adivinanza
        </label>
        <textarea
          id="question"
          name="question"
          value={formData.question}
          onChange={handleChange}
          rows={3}
          className="w-full rounded-lg bg-purple-900 border border-purple-700 focus:border-pink-500 focus:ring focus:ring-pink-500 focus:ring-opacity-50 text-white px-4 py-2"
          placeholder="Escribe la adivinanza aquí..."
          required
        />
      </div>
      
      <div className="mb-6">
        <label htmlFor="answer" className="block text-sm font-medium mb-1">
          Respuesta
        </label>
        <input
          type="text"
          id="answer"
          name="answer"
          value={formData.answer}
          onChange={handleChange}
          className="w-full rounded-lg bg-purple-900 border border-purple-700 focus:border-pink-500 focus:ring focus:ring-pink-500 focus:ring-opacity-50 text-white px-4 py-2"
          placeholder="Escribe la respuesta correcta aquí..."
          required
        />
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-6 rounded-lg shadow-lg transition-colors duration-200"
        >
          {isSubmitting ? 'Guardando...' : riddle?.id ? 'Actualizar Adivinanza' : 'Crear Adivinanza'}
        </button>
      </div>
    </form>
  );
};