import os
import pandas as pd
import re

eval_dir = "evaluation"

bertscore_averages = []

# might need to rerun deepseek model bertscores
def remove_think_tags(text):
    text = re.sub(r'<think>.*?</think>', '', text, flags=re.DOTALL).strip()
    text = text.split('---')[0].strip()
    return text

data = pd.read_csv("evaluation/llm_evaluation_results_deepseek-r1.csv")
data = data['llm_response'].apply(remove_think_tags)
data.to_csv('evaluation/llm_evaluation_results_deepseek-r1_rm.csv')

for filename in os.listdir(eval_dir):
    file_path = os.path.join(eval_dir, filename)
    try:
        data = pd.read_csv(file_path)
        first50 = data.head(50)
        avg_score = first50['bertscore_f1'].mean()
        bertscore_averages.append(avg_score)
        print(f'{filename}: avg bertscore f1 = {avg_score:.4f}')
    except Exception as e:
        print(f"error processing: {e}")

'''
results:
llm_evaluation_results_llama3.2.csv: avg bertscore f1 = 0.8404
llm_evaluation_results_gemma-2-9b.csv: avg bertscore f1 = 0.8283
llm_evaluation_results_llama3-8b.csv: avg bertscore f1 = 0.8537
llm_evaluation_results_deepseek-r1.csv: avg bertscore f1 = 0.8407
llm_evaluation_results_mistral.csv: avg bertscore f1 = 0.8581

'''