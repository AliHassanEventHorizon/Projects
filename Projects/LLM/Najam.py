import os
import json
os.environ['GRADIENT_ACCESS_TOKEN'] = "xGiWYLUTu5gAtKpyp8JQA5mwxTzPk4Vj"
os.environ['GRADIENT_WORKSPACE_ID'] = "fbb16996-6d4e-40e4-b971-e68a83f80e60_workspace"
from gradientai import Gradient

def load_samples_from_json(file_path):
    with open(file_path, 'r') as file:
        samples = json.load(file)
    return samples

def main():
    script_dir = os.path.dirname(os.path.realpath(__file__))
    json_file_path = os.path.join(script_dir, 'samples.json')

    with open(json_file_path, 'r') as file:
        data = json.load(file)

    with Gradient() as gradient:
        base = gradient.get_base_model(base_model_slug="nous-hermes2")

        new_model_adapter = base.create_model_adapter(name="Najam")
        print(f"Created model adapter with id {new_model_adapter.id}")

      
        samples = load_samples_from_json(json_file_path)

        num_epochs = 5
        count = 0
        while count < num_epochs:
            print(f"Fine-tuning the model, iteration {count + 1}")
            new_model_adapter.fine_tune(samples=samples)
            count = count + 1

       
        system_prompt = "Your are playing the Role of Najam, the older brother of your creator Ali Hassan"

        
        prompts = [
        input("Enter something: ")
        ]

       
        for prompt in prompts:
            query = f"{system_prompt} {prompt}"
            completion = new_model_adapter.complete(query=query, max_generated_token_count=500).generated_output
            print(f"Generated response for prompt: {prompt}\n{completion}\n{'='*50}\n")

if __name__ == "__main__":
    main()
