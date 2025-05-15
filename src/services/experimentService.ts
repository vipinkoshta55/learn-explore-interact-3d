
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

export type Experiment = Database['public']['Tables']['experiments']['Row'] & {
  modelUrl?: string;
};

export async function getExperimentById(id: string): Promise<Experiment | null> {
  const { data, error } = await supabase
    .from('experiments')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  
  if (error) {
    console.error('Error fetching experiment:', error);
    return null;
  }

  // If the experiment has a model path, get the download URL
  if (data && data.model_path) {
    try {
      const { data: modelData, error: modelError } = await supabase
        .storage
        .from('models')
        .createSignedUrl(data.model_path, 3600); // URL valid for 1 hour
      
      if (modelData && !modelError) {
        return { 
          ...data, 
          modelUrl: modelData.signedUrl 
        };
      } else {
        console.error('Error getting model URL:', modelError);
        return data;
      }
    } catch (error) {
      console.error('Error getting model URL:', error);
      return data;
    }
  }
  
  return data;
}

export async function listExperimentsWithModels(): Promise<Experiment[]> {
  const { data, error } = await supabase
    .from('experiments')
    .select('*')
    .not('model_path', 'is', null);
  
  if (error || !data) {
    console.error('Error fetching experiments:', error);
    return [];
  }

  // Get signed URLs for all models
  const experimentsWithUrls = await Promise.all(data.map(async (exp) => {
    if (exp.model_path) {
      try {
        const { data: modelData, error: modelError } = await supabase
          .storage
          .from('models')
          .createSignedUrl(exp.model_path, 3600); // URL valid for 1 hour
        
        if (modelData && !modelError) {
          return { 
            ...exp, 
            modelUrl: modelData.signedUrl 
          };
        }
      } catch (error) {
        console.error(`Error getting model URL for ${exp.id}:`, error);
      }
    }
    return exp;
  }));
  
  return experimentsWithUrls;
}

export async function uploadExperimentModel(
  file: File, 
  path: string, 
  experimentId: string
): Promise<boolean> {
  // Upload the file to storage
  const { data: uploadData, error: uploadError } = await supabase
    .storage
    .from('models')
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true
    });
  
  if (uploadError) {
    console.error('Error uploading model:', uploadError);
    return false;
  }
  
  // Update the experiment with the model path
  const { error: updateError } = await supabase
    .from('experiments')
    .update({ model_path: path })
    .eq('id', experimentId);
  
  if (updateError) {
    console.error('Error updating experiment:', updateError);
    return false;
  }
  
  return true;
}
