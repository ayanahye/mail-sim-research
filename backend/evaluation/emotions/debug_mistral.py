import os
import pandas as pd
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch.nn.functional as F

tokenizer = AutoTokenizer.from_pretrained('SamLowe/roberta-base-go_emotions')
model = AutoModelForSequenceClassification.from_pretrained("SamLowe/roberta-base-go_emotions")
model.eval()

labels = model.config.id2label

eval_dir = "../"

os.makedirs("../emotion_mistral", exist_ok=True)

output_dir = "../emotion_mistral"

def classify_emotions(text):
    inputs = tokenizer(text, return_tensors="pt", truncation=True)
    with torch.no_grad():
        logits = model(**inputs).logits
        probs = F.softmax(logits, dim=-1)
        top_indices = torch.topk(probs, k=3).indices[0]
        top_labels = [labels[i.item()] for i in top_indices]
        return ", ".join(top_labels)

for filename in os.listdir(eval_dir):
    if 'mistral' in filename.lower():
        file_path = os.path.join(eval_dir, filename)
        output_path = os.path.join(output_dir, filename.replace(".csv", "_emotions.csv"))

        try:
            data = pd.read_csv(file_path)

            header_written = False
            for index, row in data.iterrows():
                if index >= 50:
                    break

                row_dict = row.to_dict()
                text = row_dict.get('llm_response', '')
                emotion_labels = classify_emotions(str(text))
                row_dict['emotions'] = emotion_labels

                row_df = pd.DataFrame([row_dict])

                row_df.to_csv(output_path, mode='a', header=not header_written, index=False)
                header_written = True

                print(f"{filename} | Row {index} - Emotions: {emotion_labels}")
        except Exception as e:
            print(f"error: {e}")




